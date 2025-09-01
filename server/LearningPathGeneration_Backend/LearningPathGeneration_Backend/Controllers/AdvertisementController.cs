using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;


namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementController : ControllerBase
    {
        private readonly IAdvertisementService _service;
        private readonly DatabaseContext _context;
        private readonly KeywordService _keywordService;

        public AdvertisementController(IAdvertisementService service, DatabaseContext context, KeywordService keywordService)
        {
            _service = service;
            _context = context;
            _keywordService = keywordService;
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _service.GetAllPagedAsync(search, page, pageSize);
            var totalCount = await _service.GetTotalCountAsync(search); // Add this in service

            return Ok(new
            {
                data = result,
                totalCount = totalCount
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ad = await _service.GetByIdAsync(id);
            if (ad == null) return NotFound();
            return Ok(ad);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreateAdvertisementDto dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateAdvertisementDto dto)
        {
            var success = await _service.UpdateAsync(id, dto);
            if (!success) return NotFound();
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        /*[HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetByUserGoals(int userId)
        {
            if (userId <= 0)
                return BadRequest(new { error = "Invalid userId." });

            var adsByGoal = await _service.GetByUserGoalsAsync(userId);

            if (!adsByGoal.Any())
                return NotFound(new { message = "No advertisements found for user's goals." });

            return Ok(adsByGoal);
        }
        */
        [HttpGet("recommendations/{userId}")]
        public async Task<IActionResult> GetByUserGoalsAsync(int userId, [FromServices] KeywordService keywordService)
        {
            // 1️⃣ Get keywords from KeywordService
            var keywordDtos = await keywordService.GetKeywordsForUserAsync(userId);
            if (!keywordDtos.Any())
                return NotFound(new { error = "No keywords found for this user." });

            // 2️⃣ Combine keyword + expanded + related into one list
            var searchTerms = keywordDtos
                .SelectMany(k =>
                {
                    var terms = new List<string>();
                    if (!string.IsNullOrWhiteSpace(k.Keyword)) terms.Add(k.Keyword);
                    if (!string.IsNullOrWhiteSpace(k.Expanded)) terms.Add(k.Expanded);
                    if (k.Related != null) terms.AddRange(k.Related);
                    return terms;
                })
                .Select(t => t.ToLower())
                .Distinct()
                .ToList();

            // 3️⃣ Fetch advertisements + specifications
            var ads = await _context.Advertisements
                .Include(a => a.AdvertisementProvider)
                .Include(a => a.CreatedUser)
                .Include(a => a.AdvertisementSpecifications)
                    .ThenInclude(s => s.Specification)
                .ToListAsync();

            // 4️⃣ Match ads where ANY specification contains ANY search term
            var matchedAds = ads
                .Where(ad => ad.AdvertisementSpecifications
                    .Any(spec => !string.IsNullOrEmpty(spec.Specification.Name) &&
                                 searchTerms.Any(term =>
                                     spec.Specification.Name.ToLower().Contains(term))))
                .ToList();

            // 5️⃣ Map to DTO
            var result = matchedAds.Select(ad => new AdvertisementDto
            {
                Id = ad.Id,
                Title = ad.Title,
                Description = ad.Description,
                ImageUrl = ad.ImageUrl,
                ProviderName = ad.AdvertisementProvider?.FullName,
                CreatedUserName = ad.CreatedUser?.FirstName,
                Specifications = ad.AdvertisementSpecifications
                    .Select(s => s.Specification.Name)
                    .ToList()
            }).ToList();

            return Ok(result);
        }



    }

}

