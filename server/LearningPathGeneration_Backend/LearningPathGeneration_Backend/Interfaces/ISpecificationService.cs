using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend.Interfaces
{
    public interface ISpecificationService
    {
        Task<List<SpecificationDto>> GetAllAsync();
        Task<SpecificationDto> GetByIdAsync(int id);
        Task<SpecificationDto> CreateAsync(CreateSpecificationDto dto);
        Task<bool> UpdateAsync(int id, UpdateSpecificationDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
