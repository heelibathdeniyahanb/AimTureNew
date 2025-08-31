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

        public string GetSignedUrl(string publicId)
        {
            // This creates a signed URL for your uploaded file (PDF/image/etc.)
            var url = _cloudinary.Api.UrlImgUp
                .Secure(true) // Use https
                .Signed(true) // Sign the URL
                .BuildUrl(publicId);

            return url;
        }

        public async Task<string> UploadContentAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            await using var stream = file.OpenReadStream();
            string extension = Path.GetExtension(file.FileName).ToLower();

            UploadResult result;

            // ✅ Handle images
            if (extension == ".jpg" || extension == ".jpeg" || extension == ".png" || extension == ".gif")
            {
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "learning_content/images"
                };
                result = await _cloudinary.UploadAsync(uploadParams);
            }
            // ✅ Handle videos
            else if (extension == ".mp4" || extension == ".avi" || extension == ".mov" || extension == ".mkv")
            {
                var uploadParams = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "learning_content/videos"
                };
                result = await _cloudinary.UploadAsync(uploadParams);
            }
            // ✅ Handle PDFs (or other docs)
            /* else if (extension == ".pdf" || extension == ".docx" || extension == ".pptx")
             {
                 var uploadParams = new RawUploadParams
                 {
                     File = new FileDescription(file.FileName, stream),
                     Folder = "learning_content/docs"
                 };
                 result = await _cloudinary.UploadAsync(uploadParams);
             }*/
            else if (extension == ".pdf" || extension == ".docx" || extension == ".pptx")
            {
                var rawUploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "learning_content/docs",
                    UseFilename = true,
                    UniqueFilename = true,
                    Overwrite = true
                };
                var rawResult = await _cloudinary.UploadAsync(rawUploadParams);

                // Generate signed URL for raw files
                var url = _cloudinary.Api.UrlImgUp
                    .ResourceType("raw")
                    .Secure(true)
                    .Signed(true)
                    .BuildUrl($"{rawResult.PublicId}{extension}");

                return url;

            }
            else
            {
                throw new NotSupportedException("File type not supported");
            }

            return result.SecureUrl.ToString();
        }
    }
}
