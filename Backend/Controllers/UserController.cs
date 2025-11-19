using System.Text;
using F1Journal.Data;
using F1Journal.Models;
using F1Journal.Dtos.User;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace F1Journal.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;
    
    public UserController(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userDto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Невірний пароль або електронна адреса" });   
        
        var token = GenerateJwtToken(user);

        return Ok(new { token });
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateUser([FromBody] UserForCreationDto userDto)
    {
        var existingUser = await _db.Users
            .AnyAsync(u => u.Email == userDto.Email);
    
        if (existingUser)
        {
            return Conflict("Користувач з цією електронною адресою вже зареєстрований."); 
        }
        
        var newUser = new User
        {
            Name = userDto.Name,
            Email = userDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
        };
        
        _db.Users.Add(newUser);
        await _db.SaveChangesAsync();
        
        var userToReturn = new UserResponseDto
        {
            Id = newUser.Id,
            Name = newUser.Name,
            Email = newUser.Email
        };
        
        return CreatedAtAction(nameof(GetUsers), new { id = userToReturn.Id }, userToReturn);
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var usersFromDb = await _db.Users.ToListAsync();
        var usersDto = usersFromDb.Select(user => new
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        }).ToList();
        
        return Ok(usersDto);
    }

    [HttpGet("check-auth")]
    [Authorize]
    public IActionResult CheckAuth()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        
        var user = _db.Users.Find(userId); 
        if (user != null)
        {
            var newToken = GenerateJwtToken(user);
            return Ok(new { isAuthenticated = true, token = newToken });
        }
        
        return Ok(new { isAuthenticated = true });
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out successfully" });
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds,
            Issuer = _configuration["JwtSettings:Issuer"],
            Audience = _configuration["JwtSettings:Audience"]
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
