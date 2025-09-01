using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // <-- For ToListAsync()
using LearningPathGeneration_Backend.Models;
using LearningPathGeneration_Backend.Dtos;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Google;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Services;
using Newtonsoft.Json;

[ApiController]
[Route("api/[controller]")]
public class GoogleAiController : ControllerBase
{
    private readonly GoogleAiService _googleAiService;
    private readonly DatabaseContext _context; // ✅ inject context
    private readonly YouTubeService _youTubeService;

    public GoogleAiController(GoogleAiService googleAiService, DatabaseContext context, YouTubeService youTubeService)
    {
        _googleAiService = googleAiService;
        _context = context;
        _youTubeService = youTubeService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskQuestion([FromBody] AnalyzeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
            return BadRequest(new { error = "The 'Text' field is required." });

        try
        {
            var result = await _googleAiService.AskQuestionAsync(request.Text);
            return Ok(new { result });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { error = "Error communicating with the AI service.", details = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }

    /* [HttpPost("generate")]
     public async Task<IActionResult> GenerateLearningPath([FromBody] LearningPathRequestDto request)
     {
         if (string.IsNullOrWhiteSpace(request.Goal) ||
             string.IsNullOrWhiteSpace(request.Deadline) ||
             string.IsNullOrWhiteSpace(request.Level))
         {
             return BadRequest(new { error = "Goal, Deadline, and Level are required." });
         }

         try
         {
             var prompt = $@"
 You are an expert learning path creator.

 Create a list of MAIN TOPICS a person should learn to achieve the goal '{request.Goal}' within '{request.Deadline}'. 
 The person is at '{request.Level}' level. Just give only topics without saying anything.

 For each topic:
 - Give the topic name.

 Output as a clearly organized list.";

             var result = await _googleAiService.AskQuestionAsync(prompt);

             var topicsArray = result
                 .Split('\n')
                 .Where(line => !string.IsNullOrWhiteSpace(line))
                 .Select(line => line.TrimStart('*', '-', ' ', '\t').Trim())
                 .Where(line => !string.IsNullOrWhiteSpace(line))
                 .ToList();

             // ✅ Create LearningPathRequest object
             var newPath = new LearningPathRequest
             {
                 Goal = request.Goal,
                 Deadline = request.Deadline,
                 Level = request.Level,
                 CreatedAt = DateTime.UtcNow,
                 UserId = request.UserId,
                 Topics = new List<LearningPathTopic>()
             };
             if (request.UserId <= 0)
             {
                 return BadRequest(new { error = "UserId is required and must be valid." });
             }

             // ✅ For each topic, fetch YouTube videos based on topic + level
             foreach (var topic in topicsArray)
             {
                 // ✨ Query includes user level now
                 var searchQuery = $"{topic} tutorial {request.Level}";
                 var links = await _youTubeService.SearchTop3HighQualityVideosAsync(searchQuery);

                 newPath.Topics.Add(new LearningPathTopic
                 {
                     TopicName = topic,
                     VideoLinks = links
                 });
             }

             // ✅ Save to DB
             _context.LearningPathRequests.Add(newPath);
             await _context.SaveChangesAsync();

             // ✅ Prepare clean response
             var response = newPath.Topics.Select(t => new
             {
                 t.TopicName,
                 t.VideoLinks
             });

             return Ok(new { topics = response });
         }
         catch (HttpRequestException ex)
         {
             return StatusCode(502, new { error = "Error communicating with the AI or YouTube service.", details = ex.Message });
         }
         catch (Exception ex)
         {
             return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
         }
     }*/

    [HttpPost("generate")]
    public async Task<IActionResult> GenerateLearningPath([FromBody] LearningPathRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Goal) ||
            string.IsNullOrWhiteSpace(request.Deadline) ||
            string.IsNullOrWhiteSpace(request.Level))
        {
            return BadRequest(new { error = "Goal, Deadline, and Level are required." });
        }

        if (request.UserId <= 0)
        {
            return BadRequest(new { error = "UserId is required and must be valid." });
        }

        try
        {
            // ✅ 1. Updated AI prompt to include complexity weight
            var prompt = $@"
You are an expert learning path creator.  
Create a list of MAIN TOPICS a person should learn to achieve the goal '{request.Goal}' within '{request.Deadline}'.  
The person is at '{request.Level}' level.  

For each topic, provide:
- Topic Name
- Estimated Complexity Weight (1 to 10, where 10 is hardest)

⚠️ STRICTLY FOLLOW THIS FORMAT (do NOT add explanations, numbering, or extra text):
Topic Name | Weight
Topic Name | Weight
...
";

            // ✅ 2. Call AI service
            var aiResponse = await _googleAiService.AskQuestionAsync(prompt);

            // ✅ 3. Parse topics with weights
            var topicScopes = aiResponse
                .Split('\n')
                .Where(line => !string.IsNullOrWhiteSpace(line) && line.Contains("|"))
                .Select(line =>
                {
                    var parts = line.Split('|');
                    return new
                    {
                        Topic = parts[0].Trim(),
                        Weight = int.TryParse(parts[1].Trim(), out int w) ? w : 5 // default weight 5
                    };
                })
                .ToList();

            if (!topicScopes.Any())
                return StatusCode(500, new { error = "AI did not return topics in expected format." });

            // ✅ 4. Create LearningPathRequest
            var newPath = new LearningPathRequest
            {
                Goal = request.Goal,
                Deadline = request.Deadline,
                Level = request.Level,
                CreatedAt = DateTime.UtcNow,
                UserId = request.UserId,
                Topics = new List<LearningPathTopic>()
            };

            // ✅ 5. Calculate topic deadlines based on AI weights
            double totalWeight = topicScopes.Sum(x => x.Weight);
            DateTime startDate = DateTime.UtcNow;
            DateTime overallDeadline = DateTime.Parse(request.Deadline);
            double totalDays = (overallDeadline - startDate).TotalDays;
            DateTime currentDate = startDate;

            foreach (var item in topicScopes)
            {
                // Proportional days per topic
                double topicDays = (item.Weight / totalWeight) * totalDays;
                DateTime topicDeadline = currentDate.AddDays(topicDays);

                // ✅ 6. Fetch YouTube videos for this topic
                var searchQuery = $"{item.Topic} tutorial {request.Level}";
                var links = await _youTubeService.SearchTop3HighQualityVideosAsync(searchQuery);

                // ✅ 7. Add topic to path
                newPath.Topics.Add(new LearningPathTopic
                {
                    TopicName = item.Topic,
                    VideoLinks = links,
                    TopicDeadline = topicDeadline
                });

                currentDate = topicDeadline;
            }

            // ✅ 8. Save to DB
            _context.LearningPathRequests.Add(newPath);
            await _context.SaveChangesAsync();

            // ✅ 9. Prepare clean response
            var response = newPath.Topics.Select(t => new
            {
                t.TopicName,
                t.VideoLinks,
                t.TopicDeadline
            });

            return Ok(new { topics = response });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { error = "Error communicating with AI or YouTube service.", details = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }





    [HttpGet("learning-paths")]
    public async Task<IActionResult> GetLearningPaths()
    {
        try
        {
            var learningPaths = await _context.LearningPathRequests
                .OrderByDescending(lp => lp.CreatedAt)
                .Select(lp => new
                {
                    lp.Id,
                    lp.Goal,
                    lp.Deadline,
                    lp.Level,
                    Topics = lp.Topics
    .OrderBy(t => t.TopicDeadline)
    .Select(t => new {

        t.TopicName,
        t.VideoLinks,
        t.TopicDeadline,
        t.IsCompleted
    }),


                    lp.CreatedAt,
                    CompletionPercentage = lp.Topics.Count() == 0 ? 0 :
                    (lp.Topics.Count(t => t.IsCompleted) * 100 / lp.Topics.Count())
                })
                .ToListAsync();

            return Ok(learningPaths);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }

    [HttpDelete("learning-path/{id}")]
    public async Task<IActionResult> DeleteLearningPath(int id)
    {
        try
        {
            var learningPath = await _context.LearningPathRequests.FindAsync(id);
            if (learningPath == null)
            {
                return NotFound(new { error = "Learning path not found." });
            }

            _context.LearningPathRequests.Remove(learningPath);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Learning path deleted successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }

    [HttpGet("learning-paths/user/{userId}")]
    public async Task<IActionResult> GetLearningPathsByUser(int userId)
    {
        try
        {
            var learningPaths = await _context.LearningPathRequests
                .Where(lp => lp.UserId == userId)
                .OrderByDescending(lp => lp.CreatedAt)
                .Select(lp => new
                {
                    lp.Id,
                    lp.Goal,
                    lp.Deadline,
                    lp.Level,
                    Topics = lp.Topics
                        .OrderBy(t => t.TopicDeadline) // ✅ ensures correct order
                        .Select(t => new {
                            t.Id,
                            t.TopicName,
                            t.TopicDeadline,
                            t.VideoLinks,
                            t.IsCompleted
                        }),
                    lp.CreatedAt,
                    CompletionPercentage = lp.Topics.Count() == 0 ? 0 :
                    (lp.Topics.Count(t => t.IsCompleted) * 100 / lp.Topics.Count())
                })
                .ToListAsync();

            return Ok(learningPaths);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }

    [HttpGet("learning-path/{id}")]
    public async Task<IActionResult> GetLearningPathById(int id)
    {
        try
        {
            var learningPath = await _context.LearningPathRequests
                .Where(lp => lp.Id == id)
                .Select(lp => new
                {
                    lp.Id,
                    lp.Goal,
                    lp.Deadline,
                    lp.Level,
                    Topics = lp.Topics
                        .OrderBy(t => t.TopicDeadline)
                        .Select(t => new {
                            t.TopicName,
                            t.VideoLinks,
                            t.TopicDeadline,
                            t.IsCompleted
                        }),
                    lp.CreatedAt,

                    CompletionPercentage = lp.Topics.Count() == 0 ? 0 :
                    (lp.Topics.Count(t => t.IsCompleted) * 100 / lp.Topics.Count())

                })
                .FirstOrDefaultAsync();

            if (learningPath == null)
                return NotFound(new { error = "Learning path not found." });

            return Ok(learningPath);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }


    [HttpPatch("topic/{topicId}/complete")]
    public async Task<IActionResult> MarkTopicAsCompleted(int topicId)
    {
        try
        {
            var topic = await _context.LearningPathTopics.FindAsync(topicId);
            if (topic == null)
                return NotFound(new { error = "Topic not found." });

            topic.IsCompleted = true;
            _context.LearningPathTopics.Update(topic);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Topic marked as completed successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }

    [HttpGet("extract-keywords/user/{userId}")]
    public async Task<IActionResult> ExtractKeywordsFromUserGoals(int userId)
    {
        try
        {
            // 1️⃣ Get all goals for the user's learning path requests
            var userGoals = await _context.LearningPathRequests
                .Where(lp => lp.UserId == userId)
                .Select(lp => lp.Goal)
                .ToListAsync();

            if (!userGoals.Any())
                return NotFound(new { error = "No learning paths found for this user." });

            // 2️⃣ Combine all goals into a single text
            var combinedText = string.Join(". ", userGoals);

            // 3️⃣ Prepare prompt for AI
            var prompt = $@"
You are an expert at extracting keywords from text.  
From the text below, do the following:  
1. Extract 5-10 main keywords.  
2. Expand any abbreviations or short forms into full words.  
3. For each keyword, suggest 2-5 related keywords or concepts.  

Return the result as JSON in the following format:

[
  {{
    ""keyword"": ""<main keyword>"",
    ""expanded"": ""<expanded form if any, else same as keyword>"",
    ""related"": [""related1"", ""related2"", ...]
  }},
  ...
]

Text: {combinedText}";

            // 4️⃣ Call AI service
            var aiResponse = await _googleAiService.AskQuestionAsync(prompt);

            // 5️⃣ Clean AI response from ```json ... ``` wrapping
            aiResponse = aiResponse.Replace("```json", "")
                                   .Replace("```", "")
                                   .Trim();

            // 6️⃣ Deserialize JSON properly
            var keywords = JsonConvert.DeserializeObject<List<KeywordDto>>(aiResponse);

            return Ok(new { keywords });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { error = "Error communicating with AI service.", details = ex.Message });
        }
        catch (JsonReaderException ex)
        {
            return StatusCode(500, new { error = "Failed to parse AI response.", details = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }




}






