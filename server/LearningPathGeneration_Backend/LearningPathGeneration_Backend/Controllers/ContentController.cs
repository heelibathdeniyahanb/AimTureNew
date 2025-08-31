using LearningPathGeneration_Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        private readonly IContentService _service;

        public ContentController(IContentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contents = await _service.GetAllAsync();
            return Ok(contents);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var content = await _service.GetByIdAsync(id);
            if (content == null) return NotFound();
            return Ok(content);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ContentDto dto)
        {
            var content = new Models.Content
            {
                Title = dto.Title,
                Description = dto.Description,
                Url = dto.Url,
                ContentTypeId = dto.ContentTypeId,
                ContributorId = dto.ContributorId
            };

            var created = await _service.AddAsync(content, dto.SpecializationIds, dto.File);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ContentDto dto)
        {
            var content = new Models.Content
            {
                Id = id,
                Title = dto.Title,
                Description = dto.Description,
                Url = dto.Url,
                ContentTypeId = dto.ContentTypeId,
                ContributorId = dto.ContributorId
            };

            var updated = await _service.UpdateAsync(content, dto.SpecializationIds);
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

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var approved = await _service.ApproveContentAsync(id);
            if (!approved) return NotFound();
            return Ok(new { Message = "Content approved successfully" });
        }
    }

   
    
}

