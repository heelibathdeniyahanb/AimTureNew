using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class GoogleAiService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _apiKey;
    private readonly string _apiUrl;

    public GoogleAiService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;

        // Try to get configuration from environment variables first, then from appsettings.json
        _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY")
                ?? configuration["GEMINI_API_KEY"]
                ?? throw new InvalidOperationException("Gemini API Key is missing in configuration.");

        _apiUrl = Environment.GetEnvironmentVariable("GEMINI_URL")
                ?? configuration["GEMINI_URL"]
                ?? throw new InvalidOperationException("Gemini API URL is missing in configuration.");
    }

    public async Task<string> AskQuestionAsync(string question)
    {
        // Prepare the request payload according to Gemini API v1beta specification
        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = question }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.7,
                maxOutputTokens = 2048  // Increased token limit for longer responses
            }
        };

        // Create the HTTP request
        var client = _httpClientFactory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_apiUrl}?key={_apiKey}")
        {
            Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            )
        };

        // Send the request and get the response
        var response = await client.SendAsync(request);

        // Check if the response is successful
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Error: {response.StatusCode}. Details: {errorContent}");
        }

        try
        {
            // Read and parse the response content
            var responseContent = await response.Content.ReadAsStringAsync();
            var responseObject = JsonSerializer.Deserialize<JsonElement>(responseContent);

            // Extract the generated text from the response
            var generatedText = responseObject
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return generatedText ?? "No response generated";
        }
        catch (Exception ex)
        {
            throw new Exception($"Error parsing Gemini API response: {ex.Message}", ex);
        }
    }
}