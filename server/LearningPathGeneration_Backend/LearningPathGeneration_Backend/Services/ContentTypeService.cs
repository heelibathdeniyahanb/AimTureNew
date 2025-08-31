using Google;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Services
{
    public class ContentTypeService:IContentTypeService
    {
        private readonly DatabaseContext _context;

        public ContentTypeService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ContentType>> GetAllAsync()
        {
            return await _context.ContentTypes.ToListAsync();
        }

        public async Task<ContentType?> GetByIdAsync(int id)
        {
            return await _context.ContentTypes.FindAsync(id);
        }

        public async Task<ContentType> AddAsync(ContentType contentType)
        {
            _context.ContentTypes.Add(contentType);
            await _context.SaveChangesAsync();
            return contentType;
        }

        public async Task<ContentType?> UpdateAsync(int id, ContentType contentType)
        {
            var existing = await _context.ContentTypes.FindAsync(id);
            if (existing == null) return null;

            existing.Name = contentType.Name;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.ContentTypes.FindAsync(id);
            if (existing == null) return false;

            _context.ContentTypes.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

