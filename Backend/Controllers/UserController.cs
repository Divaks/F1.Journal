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
using Microsoft.AspNetCore.Cors;


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
            return  Unauthorized("Невірний пароль або електронна адреса");   
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };
        
        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        var token =  tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            MaxAge = TimeSpan.FromDays(7)
        };
        
        Response.Cookies.Append("jwt", tokenString, cookieOptions);
        
        return Ok("Success");
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

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateUser([FromBody] UserForCreationDto userDto)
    {
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
    
    [HttpGet("check-auth")]
    [Authorize]
    public IActionResult CheckAuth()
    {
        return Ok(new { isAuthenticated = true });
    }

    [HttpPost("logout")] 
    public async Task<IActionResult> Logout()
    {
        CookieOptions cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            MaxAge = TimeSpan.FromDays(-1)
        };   
        
        Response.Cookies.Append("jwt", "", cookieOptions);
    
        return Ok(new { message = "Logged out successfully" });
    }
}