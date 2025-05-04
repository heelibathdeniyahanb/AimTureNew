using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // <-- For ToListAsync()
using LearningPathGeneration_Backend.Models;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Google;
using LearningPathGeneration_Backend.Data;

[ApiController]
[Route("api/[controller]")]
public class GoogleAiController : ControllerBase
{
    private readonly GoogleAiService _googleAiService;
    private readonly DatabaseContext _context; // ✅ inject context

    public GoogleAiController(GoogleAiService googleAiService, DatabaseContext context)
    {
        _googleAiService = googleAiService;
        _context = context;
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

    [HttpPost("generate-learning-path")]
    public async Task<IActionResult> GenerateLearningPath([FromBody] LearningPathRequest request)
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

            // ✅ Parse result into List<string>
            // Split result by new lines and clean up each topic
            var topicsArray = result
                .Split('\n')
                .Where(line => !string.IsNullOrWhiteSpace(line))
                .Select(line => line.TrimStart('*', '-', ' ', '\t').Trim())
                .Where(line => !string.IsNullOrWhiteSpace(line))
                .ToList();

            // Save to DB
            var newPath = new LearningPathRequest
            {
                Goal = request.Goal,
                Deadline = request.Deadline,
                Level = request.Level,
                Topics = topicsArray,
                CreatedAt = DateTime.UtcNow
            };


            _context.LearningPathRequests.Add(newPath);
            await _context.SaveChangesAsync();

            return Ok(new { topics = topicsArray });
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
                    Topics = lp.Topics, // ✅ return as array
                    lp.CreatedAt
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

}
