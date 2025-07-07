using AutoMapper;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Services
{
    public class AdvertisementProviderService : IAdvertisementProviderService
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public AdvertisementProviderService(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<AdvertisemntProviderDto>> GetAllAsync()
        {
            var providers = await _context.AdvertisementProviders
                .Include(p => p.AdvertisementProviderSpecifications)
                    .ThenInclude(ap => ap.Specification)
                .ToListAsync();

            return _mapper.Map<List<AdvertisemntProviderDto>>(providers);
        }

        public async Task<AdvertisemntProviderDto> GetByIdAsync(int id)
        {
            var provider = await _context.AdvertisementProviders
                .Include(p => p.AdvertisementProviderSpecifications)
                    .ThenInclude(ap => ap.Specification)
                .FirstOrDefaultAsync(p => p.Id == id);

            return provider == null ? null : _mapper.Map<AdvertisemntProviderDto>(provider);
        }

        public async Task<AdvertisemntProviderDto> CreateAsync(CreateAdvertisementProviderDto dto)
        {
            var provider = new AdvertisementProvider
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                InstituteName = dto.InstituteName,
                AdvertisementProviderSpecifications = dto.SpecificationIds
                    .Select(specId => new AdvertiserProviderSpecification
                    {
                        SpecificationId = specId
                    }).ToList()
            };

            _context.AdvertisementProviders.Add(provider);
            await _context.SaveChangesAsync();

            return _mapper.Map<AdvertisemntProviderDto>(provider);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var provider = await _context.AdvertisementProviders.FindAsync(id);
            if (provider == null) return false;

            _context.AdvertisementProviders.Remove(provider);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
