using Google;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;
using LearningPathGeneration_Backend.Dtos;

namespace LearningPathGeneration_Backend.Services
{
    public class ContributorService
    {
        private readonly DatabaseContext _context;

        public ContributorService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<List<ContributorProfile>> GetAllAsync()
        {
            return await _context.ContributorProfiles.Include(c => c.User).ToListAsync();
        }

        public async Task<ContributorProfile> GetByIdAsync(int id)
        {
            return await _context.ContributorProfiles
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ContributorProfile> AddAsync(ContributorCreateDto dto)
        {
            var profile = new ContributorProfile
            {
                UserId = dto.UserId,
                ExpertiseArea = dto.ExpertiseArea,
                Bio = dto.Bio,
                PortfolioUrl = dto.PortfolioUrl,
                LinkedInUrl = dto.LinkedInUrl,
                Qualifications= dto.Qualifications,
            };

            _context.ContributorProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<bool> UpdateAsync(ContributorUpdateDto dto)
        {
            var existing = await _context.ContributorProfiles.FindAsync(dto.Id);
            if (existing == null) return false;

            existing.ExpertiseArea = dto.ExpertiseArea;
            existing.Qualifications = dto.Qualifications;
            existing.Bio = dto.Bio;
            existing.PortfolioUrl = dto.PortfolioUrl;
            existing.LinkedInUrl = dto.LinkedInUrl;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var contributor = await _context.ContributorProfiles.FindAsync(id);
            if (contributor == null) return false;

            _context.ContributorProfiles.Remove(contributor);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ContributorProfile> GetByUserIdAsync(int userId)
        {
            return await _context.ContributorProfiles
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.UserId == userId);
        }

    }
}
