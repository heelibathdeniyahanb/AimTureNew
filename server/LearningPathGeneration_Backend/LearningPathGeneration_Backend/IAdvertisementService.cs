using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend
{
    public interface IAdvertisementService
    {
        Task<List<AdvertisementDto>> GetAllAsync();
        Task<AdvertisementDto> GetByIdAsync(int id);
        Task<AdvertisementDto> CreateAsync(CreateAdvertisementDto dto);
        Task<bool> UpdateAsync(int id, UpdateAdvertisementDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
