using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using LearningPathGeneration_Backend.Models;

public class GoogleAiService
{
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;

    public GoogleAiService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _httpClient = httpClientFactory.CreateClient();
    }

    public async Task<string> AskQuestionAsync(string question)
    {
        // Get API options from environment variables
        var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        var apiUrl = Environment.GetEnvironmentVariable("GEMINI_URL");

        if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiUrl))
        {
            throw new InvalidOperationException("Gemini API Key or URL is missing in environment variables.");
        }

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
                maxOutputTokens = 256
            }
        };

        // Create the HTTP request
        var request = new HttpRequestMessage(HttpMethod.Post, $"{apiUrl}?key={apiKey}")
        {
            Content = new StringContent(
                JsonSerializer.Serialize(requestBody, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }),
                Encoding.UTF8,
                "application/json"
            )
        };

        // Send the request and get the response
        var response = await _httpClient.SendAsync(request);

        // Check if the response is successful
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Error: {response.StatusCode}. Details: {errorContent}");
        }

        // Read and parse the response content
        var responseContent = await response.Content.ReadAsStringAsync();
        var responseObject = JsonSerializer.Deserialize<JsonElement>(responseContent);

        // Extract the generated text from the response
        string generatedText = responseObject
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();

        return generatedText;
    }

}