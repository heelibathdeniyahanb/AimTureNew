using LearningPathGeneration_Backend.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuotesController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public QuotesController(DatabaseContext context)
        {
            _context = context;
        }


        [HttpGet("random-quote")]
        public async Task<IActionResult> GetRandomQuote()
        {
            var randomQuote = await _context.Quotes
                                  .OrderBy(q => Guid.NewGuid())
                                  .FirstOrDefaultAsync();

            if (randomQuote == null)
                return NotFound("No quotes found");

            return Ok(randomQuote);
        }

    }
}
