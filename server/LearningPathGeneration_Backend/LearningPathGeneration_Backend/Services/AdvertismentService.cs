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
        //private readonly IKeywordExtractionService _keywordExtractionService;
        public AdvertismentService(DatabaseContext context, IMapper mapper, ImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
           // _keywordExtractionService = keywordExtractionService;
        }

        public async Task<List<AdvertisementDto>> GetAllPagedAsync(string? search, int page = 1, int pageSize = 10)
        {
            var query = _context.Advertisements
                 .Include(a => a.AdvertisementProvider)
                .Include(a => a.CreatedUser)
                 .Include(a => a.AdvertisementSpecifications)
        .ThenInclude(s => s.Specification)

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
                 .Include(a => a.AdvertisementSpecifications)
        .ThenInclude(s => s.Specification)
                .ToListAsync();

            return _mapper.Map<List<AdvertisementDto>>(ads);
        }


        public async Task<AdvertisementDto> GetByIdAsync(int id)
        {
            var ad = await _context.Advertisements
     .Include(a => a.AdvertisementProvider)
     .Include(a => a.CreatedUser)
     .Include(a => a.AdvertisementSpecifications)
         .ThenInclude(s => s.Specification)
     .FirstOrDefaultAsync(a => a.Id == id);

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
                CreatedUserId = dto.CreatedUserId,
                AdvertisementSpecifications = dto.SpecificationIds.Select(specId => new AdSpecification
                {
                    SpecificationId = specId
                }).ToList()
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

       /* public async Task<Dictionary<string, List<AdvertisementDto>>> GetByUserGoalsAsync(int userId)
        {
            // 1️⃣ Get all user goals
            var userGoals = await _context.LearningPathRequests
                .Where(lp => lp.UserId == userId)
                .Select(lp => lp.Goal)
                .ToListAsync();

            if (!userGoals.Any())
                return new Dictionary<string, List<AdvertisementDto>>();

            // 2️⃣ Get all advertisements with their specifications
            var allAds = await _context.Advertisements
                .Include(a => a.AdvertisementSpecifications)
                    .ThenInclude(s => s.Specification)
                .Include(a => a.AdvertisementProvider)
                .Include(a => a.CreatedUser)
                .ToListAsync();

            var result = new Dictionary<string, List<AdvertisementDto>>();

            foreach (var goal in userGoals)
            {
                // 3️⃣ Get AI-extracted keywords for this goal
                var keywords = await _keywordExtractionService.ExtractKeywordsAsync(goal); // ✅ Using the injected service

                // 4️⃣ Match AI keywords directly to Specification.Name
                var matchedAds = allAds
                    .Where(ad => ad.AdvertisementSpecifications
                        .Any(spec =>
                            keywords.Any(k =>
                                spec.Specification.Name
                                    .Contains(k, StringComparison.OrdinalIgnoreCase)
                            )
                        ))
                    .ToList();

                // 5️⃣ Map to DTO
                var adDtos = matchedAds.Select(ad => new AdvertisementDto
                {
                    Id = ad.Id,
                    Title = ad.Title,
                    Description = ad.Description,
                    ImageUrl = ad.ImageUrl,
                    ProviderName = ad.AdvertisementProvider?.FullName,
                    CreatedUserName = ad.CreatedUser?.FirstName,
                    Specifications = ad.AdvertisementSpecifications
                        .Select(s => s.Specification.Name)  // Just get the string names
                        .ToList()
                }).ToList();

                result[goal] = adDtos;
            }

            return result;
        }*/











    }
}