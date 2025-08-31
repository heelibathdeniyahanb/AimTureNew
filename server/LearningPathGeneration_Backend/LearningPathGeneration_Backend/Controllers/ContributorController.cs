using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Models;
using LearningPathGeneration_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContributorController : ControllerBase
    {
        private readonly ContributorService _service;

        public ContributorController(ContributorService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var contributor = await _service.GetByIdAsync(id);
            if (contributor == null) return NotFound();
            return Ok(contributor);
        }

       
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContributorCreateDto dto)
        {
            var created = await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContributor(int id, ContributorUpdateDto dto)
        {
            if (id != dto.Id) return BadRequest("Contributor ID mismatch");

            var updated = await _service.UpdateAsync(dto);
            if (!updated) return NotFound();

            return Ok("Contributor updated successfully");
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [HttpGet("by-user/{userId}")]
        public async Task<ActionResult<ContributorProfile>> GetByUserId(int userId)
        {
            var contributor = await _service.GetByUserIdAsync(userId);
            if (contributor == null)
                return NotFound();

            return Ok(contributor);
        }

    }
}

