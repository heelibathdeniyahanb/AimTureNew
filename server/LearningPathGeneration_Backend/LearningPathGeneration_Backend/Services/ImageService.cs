using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.Extensions.Configuration;

namespace LearningPathGeneration_Backend.Services
{
    public class ImageService
    {
        private readonly Cloudinary _cloudinary;

        public ImageService(IConfiguration configuration)
        {
            var account = new Account(
                configuration["CLOUD_NAME"],
                configuration["APIKEY"],
                configuration["APISECRET"]
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "your_folder_name"
                };

                var result = await _cloudinary.UploadAsync(uploadParams);
                return result.SecureUrl.ToString();
            }

            return null;
        }
    }
}
