using LearningPathGeneration_Backend.Services;
using Microsoft.AspNetCore.Mvc;
using LearningPathGeneration_Backend.Dtos;
using Google.Cloud.Language.V1;

namespace LearningPathGeneration_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService;

        public AuthController(UserService userService, TokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (dto == null)
            {
                return BadRequest("User data is null");
            }
            try
            {
                var user = await _userService.Register(dto);
                return Ok(new { user.Id, user.Email, user.MobileNo, user.Role, user.FirstName, user.LastName, user.Gender, user.DateOfBirth });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.Authenticate(dto.Email, dto.Password);
            if (user == null) return Unauthorized("Invalid login credentials");

            var token = _tokenService.GenerateToken(user);
            var role = user.Role;
            var firstName = user.FirstName;
            var lastName = user.LastName;
            var dateOfBirth = user.DateOfBirth;
            var gender = user.Gender;
            var id=user.Id;
            var email = user.Email;

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Use Secure in production
                SameSite = SameSiteMode.None, // Allows cross-origin cookies
                Expires = DateTime.UtcNow.AddHours(1)
            };
            Response.Cookies.Append("jwt", token, cookieOptions);

           

            return Ok(new { message = "Logged in successfully", token, role,id,firstName,lastName,email,dateOfBirth ,gender});
        }

        [HttpGet("get-current-user")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                // Check Authorization header first
                var token = Request.Headers["Authorization"].ToString()?.Replace("Bearer ", "");

                // If no token in the header, try to get it from cookies
                if (string.IsNullOrEmpty(token))
                {
                    token = Request.Cookies["jwt"];
                    if (string.IsNullOrEmpty(token))
                    {
                        return Unauthorized("No token provided");
                    }
                }

                var userId = _tokenService.ValidateTokenAndGetUserId(token);
                if (userId == null)
                {
                    return Unauthorized("Invalid token");
                }

                var user = await _userService.GetUserById(userId.Value);
                if (user == null)
                {
                    return NotFound("User not found");
                }

                return Ok(new { user.Id, user.Email, user.FirstName });
            }
            catch (Exception ex)
            {
                return BadRequest("An error occurred.");
            }
        }




        [HttpGet("get-all-users")]
public async Task<IActionResult> GetAllUsers()
{
    try
    {
        var users = await _userService.GetAllUsers();
        if (users == null || !users.Any())
        {
            return NotFound("No users found");
        }

        return Ok(users.Select(user => new
        {
            user.Id,
            user.Email,
            user.MobileNo,
            user.Role,
            user.FirstName,
            user.LastName,
            user.Gender,
            user.DateOfBirth
        }));
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}

[HttpGet("get-user-by-id/{id:int}")]
public async Task<IActionResult> GetUserById(int id)
{
    try
    {
        var user = await _userService.GetUserById(id);
        if (user == null)
        {
            return NotFound($"User with ID {id} not found");
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            user.MobileNo,
            user.Role,
            user.FirstName,
            user.LastName,
            user.Gender,
            user.DateOfBirth
        });
    }
    catch (KeyNotFoundException ex)
    {
        return NotFound(ex.Message);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}


        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Iterate through all cookies and delete them
            foreach (var cookie in Request.Cookies.Keys)
            {
                Response.Cookies.Delete(cookie);
            }

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPut("update-user/{id:int}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var updatedUser = await _userService.UpdateUser(id, dto);
                return Ok(new
                {
                    updatedUser.Id,
                    updatedUser.Email,
                    updatedUser.MobileNo,
                    updatedUser.FirstName,
                    updatedUser.LastName,
                    updatedUser.Gender,
                    updatedUser.DateOfBirth
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete-user/{id:int}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteUser(id);
                return Ok(new { message = $"User with ID {id} has been deleted successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
