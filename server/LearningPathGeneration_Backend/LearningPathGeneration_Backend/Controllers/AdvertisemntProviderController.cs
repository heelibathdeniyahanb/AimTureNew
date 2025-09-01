using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisemntProviderController : ControllerBase
    {
        private readonly IAdvertisementProviderService _service;

        public AdvertisemntProviderController(IAdvertisementProviderService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var providers = await _service.GetAllAsync();
            return Ok(providers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var provider = await _service.GetByIdAsync(id);
            if (provider == null) return NotFound();
            return Ok(provider);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAdvertisementProviderDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
