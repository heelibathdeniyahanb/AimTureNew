using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend.Interfaces
{
    public interface IAdvertisementProviderService
    {
        Task<List<AdvertisemntProviderDto>> GetAllAsync();
        Task<AdvertisemntProviderDto> GetByIdAsync(int id);
        Task<AdvertisemntProviderDto> CreateAsync(CreateAdvertisementProviderDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
