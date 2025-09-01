using Google.Api;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContentTypeController : ControllerBase
         
    {
        private readonly IContentTypeService _service;

        public ContentTypeController(IContentTypeService service)
        {
            _service= service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var types = await _service.GetAllAsync();
            return Ok(types);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var type = await _service.GetByIdAsync(id);
            if (type == null) return NotFound();
            return Ok(type);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContentTypeDto dto)
        {
            var type = new Models.ContentType { Name = dto.Name };
            var created = await _service.AddAsync(type);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ContentTypeDto dto)
        {
            var updated = await _service.UpdateAsync(id, new Models.ContentType { Name = dto.Name });
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
