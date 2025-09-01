using AutoMapper;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Interfaces;
using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Services
{
    public class SpecificationService : ISpecificationService
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public SpecificationService(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<SpecificationDto>> GetAllAsync()
        {
            var specs = await _context.ProviderSpecifications.ToListAsync();
            return _mapper.Map<List<SpecificationDto>>(specs);
        }

        public async Task<SpecificationDto> GetByIdAsync(int id)
        {
            var spec = await _context.ProviderSpecifications.FindAsync(id);
            return spec == null ? null : _mapper.Map<SpecificationDto>(spec);
        }

        public async Task<SpecificationDto> CreateAsync(CreateSpecificationDto dto)
        {
            var spec = _mapper.Map<ProviderSpecifications>(dto); // ✅ correct mapping
            _context.ProviderSpecifications.Add(spec);
            await _context.SaveChangesAsync();
            return _mapper.Map<SpecificationDto>(spec);
        }


        public async Task<bool> UpdateAsync(int id, UpdateSpecificationDto dto)
        {
            var spec = await _context.ProviderSpecifications.FindAsync(id);
            if (spec == null) return false;

            spec.Name = dto.Name;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var spec = await _context.ProviderSpecifications.FindAsync(id);
            if (spec == null) return false;

            _context.ProviderSpecifications.Remove(spec);
            await _context.SaveChangesAsync();
            return true;
        }
    }

}
