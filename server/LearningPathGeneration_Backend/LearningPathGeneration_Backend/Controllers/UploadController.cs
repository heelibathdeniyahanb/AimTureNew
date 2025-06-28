using LearningPathGeneration_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningPathGeneration_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly ImageService _imageService;

        public UploadController(ImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            var url = await _imageService.UploadImageAsync(image);
            if (url != null)
                return Ok(new { imageUrl = url });
            return BadRequest("Upload failed");
        }
    }
}
