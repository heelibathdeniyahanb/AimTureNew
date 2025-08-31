using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Models;
using System;
using Microsoft.EntityFrameworkCore;

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

        public async Task<IEnumerable<Content>> GetAllAsync()
        {
            return await _context.Contents
                .Include(c => c.Contributor).ThenInclude(cp => cp.User)
                .Include(c => c.ContentType)
                .Include(c => c.ContentSpecializations)
                    .ThenInclude(cs => cs.ContentSpecialization)
                .ToListAsync();
        }

        public async Task<Content?> GetByIdAsync(int id)
        {
            return await _context.Contents
                .Include(c => c.Contributor).ThenInclude(cp => cp.User)
                .Include(c => c.ContentType)
                .Include(c => c.ContentSpecializations)
                    .ThenInclude(cs => cs.ContentSpecialization)
                .FirstOrDefaultAsync(c => c.Id == id);
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

