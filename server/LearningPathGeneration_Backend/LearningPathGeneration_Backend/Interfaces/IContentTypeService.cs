using LearningPathGeneration_Backend.Models;

namespace LearningPathGeneration_Backend.Interfaces
{
    public interface IContentTypeService
    {
        Task<IEnumerable<ContentType>> GetAllAsync();
        Task<ContentType?> GetByIdAsync(int id);
        Task<ContentType> AddAsync(ContentType contentType);
        Task<ContentType?> UpdateAsync(int id, ContentType contentType);
        Task<bool> DeleteAsync(int id);
    }
}
