using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Models;
using Org.BouncyCastle.Crypto;
using System;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using LearningPathGeneration_Backend.Interfaces;

namespace LearningPathGeneration_Backend.Services
{
    public class AdvertismentService : IAdvertisementService
    {

        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;    
        public AdvertismentService(DatabaseContext context, IMapper mapper, ImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
        }

        public async Task<List<AdvertisementDto>> GetAllPagedAsync(string? search, int page = 1, int pageSize = 10)
        {
            var query = _context.Advertisements
                 .Include(a => a.AdvertisementProvider)
                .Include(a => a.CreatedUser)
                
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(a =>
                    a.Title.ToLower().Contains(search) ||
                    a.Description.ToLower().Contains(search));
            }


            query = query
                .OrderByDescending(a => a.CreatedAt) // Sort by newest
                .Skip((page - 1) * pageSize)
                .Take(pageSize);

            var ads = await query.ToListAsync();
            return _mapper.Map<List<AdvertisementDto>>(ads);
        }

        public async Task<List<AdvertisementDto>> GetAllAsync()
        {
            var ads = await _context.Advertisements
                .Include(a => a.AdvertisementProvider)
                .Include(a => a.CreatedUser)
                .ToListAsync();

            return _mapper.Map<List<AdvertisementDto>>(ads);
        }


        public async Task<AdvertisementDto> GetByIdAsync(int id)
        {
            var ad = await _context.Advertisements.FindAsync(id);
            return ad == null ? null : _mapper.Map<AdvertisementDto>(ad);
        }

        public async Task<AdvertisementDto> CreateAsync(CreateAdvertisementDto dto)
        {
            string imageUrl = null;

            if (dto.Image != null && dto.Image.Length > 0)
            {
                imageUrl = await _imageService.UploadImageAsync(dto.Image);
            }

            var ad = new Advertisement
            {
                Title = dto.Title,
                Description = dto.Description,
                ImageUrl = imageUrl,
                AdvertisementProviderId = dto.AdvertisementProviderId,
                CreatedUserId = dto.CreatedUserId
            };

            _context.Advertisements.Add(ad);
            await _context.SaveChangesAsync();
            await _context.Entry(ad).Reference(a => a.AdvertisementProvider).LoadAsync();
            await _context.Entry(ad).Reference(a => a.CreatedUser).LoadAsync();
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

        public async Task<int> GetTotalCountAsync(string? search)
        {
            var query = _context.Advertisements.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(a =>
                    a.Title.ToLower().Contains(search) ||
                    a.Description.ToLower().Contains(search));
            }

            return await query.CountAsync();
        }

    }
}