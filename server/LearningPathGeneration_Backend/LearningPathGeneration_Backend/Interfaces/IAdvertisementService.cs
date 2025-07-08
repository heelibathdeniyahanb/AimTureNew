using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend.Interfaces
{
    public interface IAdvertisementService
    {
        Task<List<AdvertisementDto>> GetAllPagedAsync(string? search, int page = 1, int pageSize = 10);
        Task<int> GetTotalCountAsync(string? search);
        Task<List<AdvertisementDto>> GetAllAsync();
        Task<AdvertisementDto> GetByIdAsync(int id);
        Task<AdvertisementDto> CreateAsync(CreateAdvertisementDto dto);
        Task<bool> UpdateAsync(int id, UpdateAdvertisementDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
