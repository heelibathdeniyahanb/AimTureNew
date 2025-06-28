using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Models;
using Org.BouncyCastle.Crypto;
using System;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace LearningPathGeneration_Backend.Services
{
    public class AdvertismentService : IAdvertisementService
    {

        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public AdvertismentService(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<AdvertisementDto>> GetAllAsync()
        {
            var ads = await _context.Advertisements.ToListAsync();
            return _mapper.Map<List<AdvertisementDto>>(ads);
        }

        public async Task<AdvertisementDto> GetByIdAsync(int id)
        {
            var ad = await _context.Advertisements.FindAsync(id);
            return ad == null ? null : _mapper.Map<AdvertisementDto>(ad);
        }

        public async Task<AdvertisementDto> CreateAsync(CreateAdvertisementDto dto)
        {
            var ad = _mapper.Map<Advertisement>(dto);
            _context.Advertisements.Add(ad);
            await _context.SaveChangesAsync();
            return _mapper.Map<AdvertisementDto>(ad);
        }

        public async Task<bool> UpdateAsync(int id, UpdateAdvertisementDto dto)
        {
            var ad = await _context.Advertisements.FindAsync(id);
            if (ad == null) return false;

            _mapper.Map(dto, ad);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ad = await _context.Advertisements.FindAsync(id);
            if (ad == null) return false;

            _context.Advertisements.Remove(ad);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}