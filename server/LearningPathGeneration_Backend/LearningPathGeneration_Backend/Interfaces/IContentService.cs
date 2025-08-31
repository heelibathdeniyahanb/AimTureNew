using LearningPathGeneration_Backend.Models;

namespace LearningPathGeneration_Backend.Interfaces
{
    public interface IContentService
    {
        Task<IEnumerable<Content>> GetAllAsync();
        Task<Content?> GetByIdAsync(int id);
        Task<Content> AddAsync(Content content, List<int> specializationIds, IFormFile file);
        Task<Content?> UpdateAsync(Content content, List<int> specializationIds);
        Task<bool> DeleteAsync(int id);
        Task<bool> ApproveContentAsync(int id); // For Admin Approval
    }
}
