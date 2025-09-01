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

        public string GetSignedUrl(string publicId, string resourceType = "image")
        {
            // Create appropriate URL based on resource type
            try
            {
                if (resourceType == "raw")
                {
                    // For PDFs and documents - try different approach
                    var transformation = new Transformation();
                    var url = _cloudinary.Api.UrlImgUp
                        .ResourceType("raw")
                        .Secure(true)
                        .Transform(transformation)
                        .BuildUrl(publicId);
                    return url;
                }
                else
                {
                    // For images and videos
                    return _cloudinary.Api.UrlImgUp
                        .Secure(true)
                        .Signed(true)
                        .BuildUrl(publicId);
                }
            }
            catch (Exception ex)
            {
                // Log the exception and return basic URL
                Console.WriteLine($"Error generating signed URL: {ex.Message}");
                return $"https://res.cloudinary.com/{_cloudinary.Api.Account.Cloud}/raw/upload/{publicId}";
            }
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
                return result.SecureUrl.ToString();
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
                return result.SecureUrl.ToString();
            }
            // ✅ Handle PDFs and documents - SIMPLEST APPROACH
            else if (extension == ".pdf" || extension == ".docx" || extension == ".pptx")
            {
                var rawUploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Folder = "learning_content/docs",
                    UseFilename = true,
                    UniqueFilename = false,  // Changed to false
                    Overwrite = false        // Changed to false
                };

                var rawResult = await _cloudinary.UploadAsync(rawUploadParams);

                // Try multiple URL formats to ensure one works
                // First try the direct secure URL
                var directUrl = rawResult.SecureUrl?.ToString();
                if (!string.IsNullOrEmpty(directUrl))
                {
                    return directUrl;
                }

                // Fallback: Build URL manually
                var fallbackUrl = $"https://res.cloudinary.com/{_cloudinary.Api.Account.Cloud}/raw/upload/{rawResult.PublicId}";
                return fallbackUrl;
            }
            else
            {
                throw new NotSupportedException($"File type {extension} not supported");
            }
        }

        // Simple method to get displayable URL for any uploaded file
        public string GetDisplayUrl(string publicId, bool isPdf = false)
        {
            if (isPdf)
            {
                // For PDFs - try unsigned URL first
                return $"https://res.cloudinary.com/{_cloudinary.Api.Account.Cloud}/raw/upload/{publicId}";
            }
            else
            {
                // For images
                return _cloudinary.Api.UrlImgUp
                    .Secure(true)
                    .BuildUrl(publicId);
            }
        }

        // Alternative: Convert PDF to image for guaranteed display
        public async Task<string> UploadPdfAsImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            await using var stream = file.OpenReadStream();

            // Upload PDF and then generate image URL with transformation
            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "learning_content/pdf_previews"
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            // Generate image URL with PDF to JPG transformation
            var imageUrl = _cloudinary.Api.UrlImgUp
                .ResourceType("image")
                .Format("jpg")
                .Transform(new Transformation().Page(1).Quality("auto"))
                .Secure(true)
                .BuildUrl($"{result.PublicId}.pdf");

            return imageUrl;
        }

        // Method to store original PDF and return preview image
        public async Task<(string originalUrl, string previewUrl)> UploadPdfWithPreviewAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return (null, null);

            await using var stream = file.OpenReadStream();

            // Upload original PDF as raw file
            var rawUploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "learning_content/docs"
            };
            var originalResult = await _cloudinary.UploadAsync(rawUploadParams);

            // Generate preview image URL using transformation
            var previewUrl = _cloudinary.Api.UrlImgUp
                .ResourceType("image")
                .Format("jpg")
                .Transform(new Transformation().Page(1).Quality("auto").Width(800))
                .Secure(true)
                .BuildUrl($"{originalResult.PublicId}.pdf");

            var originalUrl = originalResult.SecureUrl?.ToString() ??
                             $"https://res.cloudinary.com/{_cloudinary.Api.Account.Cloud}/raw/upload/{originalResult.PublicId}";

            return (originalUrl, previewUrl);
        }
    }
}