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

Create a  list of MAIN TOPICS a person should learn to achieve the goal '{request.Goal}' within '{request.Deadline}'. 
The person is at '{request.Level}' level.just give only topics without saying anything.

For each topic:
- Give the topic name.


Output as a clearly organized list.";

            var result = await _googleAiService.AskQuestionAsync(prompt);

            // Save to DB
            var newPath = new LearningPathRequest
            {
                Goal = request.Goal,
                Deadline = request.Deadline,
                Level = request.Level,
                Topics = result,
                CreatedAt = DateTime.UtcNow
            };

            _context.LearningPathRequests.Add(newPath);
            await _context.SaveChangesAsync();

            return Ok(new { topics = result });
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
                .ToListAsync();

            return Ok(learningPaths);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An unexpected error occurred.", details = ex.Message });
        }
    }
}
