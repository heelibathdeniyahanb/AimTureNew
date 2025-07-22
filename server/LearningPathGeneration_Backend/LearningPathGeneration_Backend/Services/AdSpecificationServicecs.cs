using AutoMapper;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Services
{
    public class AdSpecificationService : IAdSpecificationService
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public AdSpecificationService(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<AdSpecificationDto>> GetAllAsync()
        {
            var allSpecs = await _context.AdvertisemnetSpecifications
                .Include(x => x.Specification)
                .Include(x => x.Advertisement)
                .ToListAsync();

            return _mapper.Map<List<AdSpecificationDto>>(allSpecs);
        }

        public async Task<List<AdSpecificationDto>> GetByAdvertisementIdAsync(int adId)
        {
            var specs = await _context.AdvertisemnetSpecifications
                .Include(x => x.Specification)
                .Where(x => x.AdvertisementId == adId)
                .ToListAsync();

            return _mapper.Map<List<AdSpecificationDto>>(specs);
        }

        public async Task<AdSpecificationDto> CreateAsync(CreateAdSpecificationDto dto)
        {
            var spec = _mapper.Map<AdSpecification>(dto);
            _context.AdvertisemnetSpecifications.Add(spec);
            await _context.SaveChangesAsync();
            return _mapper.Map<AdSpecificationDto>(spec);

            
        }

        public async Task<bool> UpdateAsync(int oldAdId, int oldSpecId, CreateAdSpecificationDto newData)
        {
            var entity = await _context.AdvertisemnetSpecifications
                .FirstOrDefaultAsync(x => x.AdvertisementId == oldAdId && x.SpecificationId == oldSpecId);

            if (entity == null) return false;

            // Remove the old entry
            _context.AdvertisemnetSpecifications.Remove(entity);

            // Add new entry
            var newEntity = _mapper.Map<AdSpecification>(newData);
            _context.AdvertisemnetSpecifications.Add(newEntity);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int adId, int specId)
        {
            var entity = await _context.AdvertisemnetSpecifications
                .FirstOrDefaultAsync(x => x.AdvertisementId == adId && x.SpecificationId == specId);

            if (entity == null) return false;

            _context.AdvertisemnetSpecifications.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
