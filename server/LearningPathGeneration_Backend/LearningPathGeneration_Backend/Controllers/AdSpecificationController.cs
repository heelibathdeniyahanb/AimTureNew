using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class AdSpecificationController : ControllerBase
{
    private readonly IAdSpecificationService _service;

    public AdSpecificationController(IAdSpecificationService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{adId}")]
    public async Task<IActionResult> GetByAd(int adId)
    {
        var result = await _service.GetByAdvertisementIdAsync(adId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAdSpecificationDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return created == null ? Conflict("Already exists.") : Created("", created);
    }

    [HttpPut("{oldAdId}/{oldSpecId}")]
    public async Task<IActionResult> Update(int oldAdId, int oldSpecId, CreateAdSpecificationDto newDto)
    {
        var updated = await _service.UpdateAsync(oldAdId, oldSpecId, newDto);
        return updated ? NoContent() : NotFound("Original mapping not found.");
    }

    [HttpDelete("{adId}/{specId}")]
    public async Task<IActionResult> RemoveSpecification(int adId, int specId)
    {
        var deleted = await _service.DeleteAsync(adId, specId);
        return deleted ? NoContent() : NotFound();
    }
}
