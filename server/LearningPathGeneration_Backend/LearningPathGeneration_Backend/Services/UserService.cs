using LearningPathGeneration_Backend.Controllers;
using LearningPathGeneration_Backend.Data;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Services
{
    public class UserService
    {
        private readonly DatabaseContext _context;
        private readonly EmailController _emailController;

        public UserService(DatabaseContext context,EmailController emailController)
        {
            _context = context;
            _emailController = emailController;
        }

        private string GenerateTemporaryPassword(int length = 12)
        {
            const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?_-";
            var random = new Random();
            return new string(Enumerable.Repeat(validChars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<User?> Authenticate(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                return null;
            }
            return user;
        }

        public async Task<User> Register(RegisterDto dto)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (existingUser != null)
            {
                throw new ArgumentException("Email already exists");
            }


            // Generate a temporary password
            var temporaryPassword = GenerateTemporaryPassword();

            // Hash the generated password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(temporaryPassword);

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = hashedPassword,
                MobileNo = dto.MobileNo,
                Role = dto.Role,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            // Send login details to user's email
            await _emailController.SendLoginDetails(user.Email, temporaryPassword);
        

            return user;
        }

        public async Task<User> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");
            }

            // Update user properties if provided
            user.Email = dto.Email ?? user.Email;
            user.MobileNo = dto.MobileNo ?? user.MobileNo;
            user.FirstName = dto.FirstName ?? user.FirstName;
            user.LastName = dto.LastName ?? user.LastName;
            user.Gender = dto.Gender ?? user.Gender;
            user.DateOfBirth = dto.DateOfBirth ?? user.DateOfBirth;

            await _context.SaveChangesAsync();
            return user;
        }


        public async Task<User> GetUserById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");
            }
            return user;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }


        public async Task<bool> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SendResetCodeAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                throw new ArgumentException("User not found");

            var code = new Random().Next(100000, 999999).ToString();
            var expiry = DateTime.UtcNow.AddMinutes(15);

            var token = new PasswordResetToken
            {
                Email = email,
                Code = code,
                ExpiryTime = expiry
            };

            // Remove previous codes for this email
            var existingTokens = _context.PasswordResetTokens.Where(t => t.Email == email);
            _context.PasswordResetTokens.RemoveRange(existingTokens);

            _context.PasswordResetTokens.Add(token);
            await _context.SaveChangesAsync();

            await _emailController.SendResetCode(email, code);
        }

        public async Task<bool> VerifyResetCodeAsync(string email, string code)
        {
            var token = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Email == email && t.Code == code);

            return token != null && token.ExpiryTime > DateTime.UtcNow;
        }

        public async Task ResetPasswordAsync(string email, string code, string newPassword)
        {
            var token = await _context.PasswordResetTokens
                .FirstOrDefaultAsync(t => t.Email == email && t.Code == code);

            if (token == null || token.ExpiryTime < DateTime.UtcNow)
                throw new ArgumentException("Invalid or expired code");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                throw new ArgumentException("User not found");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

            _context.PasswordResetTokens.Remove(token);
            await _context.SaveChangesAsync();
        }

    }
}
