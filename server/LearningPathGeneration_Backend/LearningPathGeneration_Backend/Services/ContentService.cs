using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Models;
using System;
using Microsoft.EntityFrameworkCore;
using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend.Services
{
    public class ContentService : IContentService
    {
        private readonly DatabaseContext _context;
        private readonly ImageService _imageService;

        public ContentService(DatabaseContext context, ImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        public async Task<IEnumerable<ContentResponseDto>> GetAllContentsAsync()
        {
            var contents = await _context.Contents
                .Include(c => c.Contributor)
                .Include(c => c.ContentType)
                .ToListAsync();

            var result = new List<ContentResponseDto>();

            foreach (var c in contents)
            {
                // Get specialization names from join table
                var specializationNames = await _context.ContentSpecializationJoins
                    .Where(cs => cs.ContentId == c.Id)
                    .Include(cs => cs.ContentSpecialization)
                    .Select(cs => cs.ContentSpecialization.Name)
                    .ToListAsync();

                result.Add(new ContentResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Url = c.Url,
                    ContentTypeName = c.ContentType?.Name ?? "Unknown",
                    ContributorName = c.Contributor?.User?.FirstName ?? "Unknown",
                    SpecializationNames = specializationNames
                });
            }

            return result;
        }

        public async Task<ContentResponseDto?> GetContentByIdAsync(int id)
        {
            var c = await _context.Contents
                .Include(c => c.Contributor)
                .Include(c => c.ContentType)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (c == null) return null;

            var specializationNames = await _context.ContentSpecializationJoins
                .Where(cs => cs.ContentId == c.Id)
                .Include(cs => cs.ContentSpecialization)
                .Select(cs => cs.ContentSpecialization.Name)
                .ToListAsync();

            return new ContentResponseDto
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Url = c.Url,
                ContentTypeName = c.ContentType?.Name ?? "Unknown",
                ContributorName = c.Contributor?.User?.FirstName ?? "Unknown",
                SpecializationNames = specializationNames
            };
        }


        public async Task<Content> AddAsync(Content content, List<int> specializationIds, IFormFile file)
        {
            // Upload to cloudinary
            if (file != null)
            {
                content.Url = await _imageService.UploadContentAsync(file);
            }

            _context.Contents.Add(content);
            await _context.SaveChangesAsync();

            foreach (var specId in specializationIds)
            {
                _context.ContentSpecializationJoins.Add(new ContentSpecializationJoin
                {
                    ContentId = content.Id,
                    ContentSpecializationId = specId
                });
            }

            await _context.SaveChangesAsync();
            return content;
        }

        public async Task<Content?> UpdateAsync(Content content, List<int> specializationIds)
        {
            var existing = await _context.Contents
                .Include(c => c.ContentSpecializations)
                .FirstOrDefaultAsync(c => c.Id == content.Id);

            if (existing == null) return null;

            // Update fields
            existing.Title = content.Title;
            existing.Description = content.Description;
            existing.Url = content.Url;
            existing.ContentTypeId = content.ContentTypeId;
            existing.ContributorId = content.ContributorId;

            // Update specialization mapping
            _context.ContentSpecializationJoins.RemoveRange(existing.ContentSpecializations);

            foreach (var specId in specializationIds)
            {
                _context.ContentSpecializationJoins.Add(new ContentSpecializationJoin
                {
                    ContentId = content.Id,
                    ContentSpecializationId = specId
                });
            }

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var content = await _context.Contents.FindAsync(id);
            if (content == null) return false;

            _context.Contents.Remove(content);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ApproveContentAsync(int id)
        {
            var content = await _context.Contents.FindAsync(id);
            if (content == null) return false;

            content.IsApproved = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

