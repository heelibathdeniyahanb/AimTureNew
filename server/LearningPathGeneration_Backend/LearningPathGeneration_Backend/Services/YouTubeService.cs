using Microsoft.Extensions.Configuration;
using System.Text.Json;

public class YouTubeService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _apiKey;

    public YouTubeService(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _apiKey = Environment.GetEnvironmentVariable("YouTubeApiKey") ??
                  configuration["YouTubeApiKey"] ??
                  throw new InvalidOperationException("YouTube API key not configured.");
    }

    public async Task<List<string>> SearchTop3VideosAsync(string query)
    {
        var client = _httpClientFactory.CreateClient();
        var url = $"https://www.googleapis.com/youtube/v3/search?part=snippet&q={Uri.EscapeDataString(query)}&key={_apiKey}&maxResults=3&type=video";

        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var jsonResponse = JsonSerializer.Deserialize<JsonElement>(content);

        var videoLinks = new List<string>();

        if (jsonResponse.TryGetProperty("items", out var items))
        {
            foreach (var item in items.EnumerateArray())
            {
                if (item.TryGetProperty("id", out var id) && id.TryGetProperty("videoId", out var videoId))
                {
                    videoLinks.Add($"https://www.youtube.com/watch?v={videoId.GetString()}");
                }
            }
        }

        return videoLinks;
    }

    public async Task<List<string>> SearchTop3HighQualityVideosAsync(string query)
    {
        var client = _httpClientFactory.CreateClient();

        // Step 1: Search
        var searchUrl = $"https://www.googleapis.com/youtube/v3/search?part=snippet&q={Uri.EscapeDataString(query)}&key={_apiKey}&maxResults=10&type=video&order=viewCount";
        var searchResponse = await client.GetAsync(searchUrl);
        searchResponse.EnsureSuccessStatusCode();
        var searchContent = await searchResponse.Content.ReadAsStringAsync();
        var searchJson = JsonSerializer.Deserialize<JsonElement>(searchContent);

        var videoIds = new List<string>();
        if (searchJson.TryGetProperty("items", out var items))
        {
            foreach (var item in items.EnumerateArray())
            {
                if (item.TryGetProperty("id", out var id) && id.TryGetProperty("videoId", out var videoId))
                {
                    videoIds.Add(videoId.GetString());
                }
            }
        }

        // Step 2: Get video statistics
        var idsCommaSeparated = string.Join(",", videoIds);
        var statsUrl = $"https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id={idsCommaSeparated}&key={_apiKey}";
        var statsResponse = await client.GetAsync(statsUrl);
        statsResponse.EnsureSuccessStatusCode();
        var statsContent = await statsResponse.Content.ReadAsStringAsync();
        var statsJson = JsonSerializer.Deserialize<JsonElement>(statsContent);

        // Step 3: Rank videos by likes/comments
        var rankedVideos = new List<(string VideoId, long LikeCount, DateTime PublishedAt)>();

        if (statsJson.TryGetProperty("items", out var statItems))
        {
            foreach (var item in statItems.EnumerateArray())
            {
                var id = item.GetProperty("id").GetString();
                var stats = item.GetProperty("statistics");
                var snippet = item.GetProperty("snippet");

                long likes = stats.TryGetProperty("likeCount", out var likeProp) ? long.Parse(likeProp.GetString()) : 0;
                DateTime publishedAt = snippet.TryGetProperty("publishedAt", out var pubProp)
                    ? DateTime.Parse(pubProp.GetString())
                    : DateTime.MinValue;

                rankedVideos.Add((id, likes, publishedAt));
            }
        }

        // Order by likes descending, then by most recent
        var topVideos = rankedVideos
            .OrderByDescending(v => v.LikeCount)
            .ThenByDescending(v => v.PublishedAt)
            .Take(3)
            .Select(v => $"https://www.youtube.com/watch?v={v.VideoId}")
            .ToList();

        return topVideos;
    }

}

