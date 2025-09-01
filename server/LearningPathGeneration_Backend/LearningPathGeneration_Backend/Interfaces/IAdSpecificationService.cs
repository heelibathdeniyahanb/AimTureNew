using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend.Interfaces
{
    public interface IAdSpecificationService
    {
        Task<List<AdSpecificationDto>> GetAllAsync();
        Task<List<AdSpecificationDto>> GetByAdvertisementIdAsync(int adId);
        Task<AdSpecificationDto> CreateAsync(CreateAdSpecificationDto dto);
        Task<bool> UpdateAsync(int oldAdId, int oldSpecId, CreateAdSpecificationDto newData);
        Task<bool> DeleteAsync(int adId, int specId);
    }
}
