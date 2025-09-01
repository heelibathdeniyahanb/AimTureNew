using LearningPathGeneration_Backend.Data;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

public class KeywordService
{
    private readonly GoogleAiService _googleAiService;
    private readonly DatabaseContext _context;

    public KeywordService(GoogleAiService googleAiService, DatabaseContext context)
    {
        _googleAiService = googleAiService;
        _context = context;
    }

    public async Task<List<KeywordDto>> GetKeywordsForUserAsync(int userId)
    {
        var userGoals = await _context.LearningPathRequests
            .Where(lp => lp.UserId == userId)
            .Select(lp => lp.Goal)
            .ToListAsync();

        if (!userGoals.Any())
            return new List<KeywordDto>();

        var combinedText = string.Join(". ", userGoals);

        var prompt = $@"
You are an expert at extracting keywords from text.  
From the text below, do the following:  
1. Extract 5-10 main keywords.  
2. Expand abbreviations into full words.  
3. For each keyword, suggest 2-5 related keywords.

Return ONLY valid JSON (no explanation, no markdown) in this format:
[
  {{
    ""keyword"": ""<main keyword>"",
    ""expanded"": ""<expanded form>"",
    ""related"": [""related1"", ""related2""]
  }}
]

Text: {combinedText}";

        var aiResponse = await _googleAiService.AskQuestionAsync(prompt);

        // 🧹 Sanitize AI response
        var cleaned = aiResponse
            .Trim()
            .Replace("```json", "")
            .Replace("```", "");

        // Sometimes model wraps extra text, try regex to extract JSON array
        var match = Regex.Match(cleaned, @"\[.*\]", RegexOptions.Singleline);
        if (match.Success)
        {
            cleaned = match.Value;
        }

        try
        {
            var keywordsList = JsonConvert.DeserializeObject<List<KeywordDto>>(cleaned);
            return keywordsList ?? new List<KeywordDto>();
        }
        catch (JsonException ex)
        {
            // Log for debugging
            Console.WriteLine("❌ Failed to parse AI response: " + cleaned);
            Console.WriteLine(ex);
            return new List<KeywordDto>();
        }
    }
}

public class KeywordDto
{
    public string Keyword { get; set; }
    public string Expanded { get; set; }
    public List<string> Related { get; set; }
}
