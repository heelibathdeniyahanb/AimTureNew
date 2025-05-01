using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using LearningPathGeneration_Backend.Models;

[ApiController]
[Route("api/[controller]")]
public class GoogleAiController : ControllerBase
{
    private readonly GoogleAiService _googleAiService;

    public GoogleAiController(GoogleAiService googleAiService)
    {
        _googleAiService = googleAiService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> AskQuestion([FromBody] AnalyzeRequest request)
    {
        // Validate the input
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            return BadRequest(new { error = "The 'Text' field is required." });
        }

        try
        {
            // Call the AskQuestionAsync method in the service
            var result = await _googleAiService.AskQuestionAsync(request.Text);
            return Ok(new { result });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new { error = "Error communicating with the AI service.", details = ex.Message });
        }
        catch (System.Exception ex)
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

Create a detailed list of MAIN TOPICS a person should learn to achieve the goal '{request.Goal}' within '{request.Deadline}'. 
The person is at '{request.Level}' level.

For each topic:
- Give the topic name.
- Provide a short summary (2–3 sentences) explaining what the topic is about and why it's important.

Output as a clearly organized list.
";

            var result = await _googleAiService.AskQuestionAsync(prompt);

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


}