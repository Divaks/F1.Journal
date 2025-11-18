using F1Journal.Data;
using F1Journal.Dtos.User;
using System.Security.Claims;
using F1Journal.Dtos;
using F1Journal.Dtos.Review;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace F1Journal.Controllers;

[ApiController]
[Route("api")]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;
    
    public DashboardController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("dashboard")]
    [Authorize]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var RaceReviewsFromDb = await _db.RaceReviews
            .Where(r => r.UserId == userId)
            .Include(r => r.User)
            .Include(r => r.Race)
            .ToListAsync();
        
        var RaceReviewsDto = RaceReviewsFromDb.Select(r => new RaceReviewResponseDto()
        {
            Id = r.Id,
            Mark = r.Mark,
            Description = r.Description,
            RaceId = r.RaceId,
            RaceName = r.Race.Name,
            Author = new UserResponseDto
            {
                Id = r.User.Id,
                Name = r.User.Name,
                Email = r.User.Email
            }
        }).ToList();
        
        var TeamPerformanceReviewsFromDb = await _db.TeamPerformanceReviews
            .Where(t => t.UserId == userId)
            .Include(t => t.User)
            .Include(t => t.Team)
            .ToListAsync();
        
        var TeamPerformanceReviewsDto = TeamPerformanceReviewsFromDb
            .Select(t => new TeamPerformanceReviewResponseDto()
        {
            Id = t.Id,
            Mark = t.Mark,
            Description = t.Description,
            TeamId = t.TeamId,
            RaceId = t.RaceId,
            TeamName =  t.Team.Name,
            Author = new UserResponseDto
            {
                Id = t.User.Id,
                Name = t.User.Name,
                Email = t.User.Email
            }
        }).ToList();
        
        var DriverPerformanceReviewsFromDb = await _db.DriverPerformanceReviews
            .Where(d => d.UserId == userId)
            .Include(d => d.User)
            .Include(d => d.Driver)
            .ToListAsync();
        
        var DriverPerformanceReviewsDto = DriverPerformanceReviewsFromDb
            .Select(d => new DriverPerformanceReviewResponseDto()
        {
            Id = d.Id,
            Mark = d.Mark,
            Description = d.Description,
            DriverId = d.DriverId,
            DriverName = d.Driver.Name,
            RaceId = d.RaceId,
            Author = new UserResponseDto
            {
                Id = d.User.Id,
                Name = d.User.Name,
                Email = d.User.Email
            }
        }).ToList();
        
        return Ok(new DashboardResponseDto 
            { 
                RaceReviews = RaceReviewsDto, 
                TeamPerformanceReviews = TeamPerformanceReviewsDto, 
                DriverPerformanceReviews = DriverPerformanceReviewsDto 
            });
    }
    
    [HttpGet("driver")]
    [Authorize]
    public async Task<ActionResult<List<DriverPerformanceReviewResponseDto>>> GetMyDriverReviews()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var reviews = await _db.DriverPerformanceReviews
            .Where(r => r.UserId == userId)
            .Include(r => r.User)
            .Include(r => r.Driver)
            .Select(r => new DriverPerformanceReviewResponseDto 
            {
                Id = r.Id,
                Mark = r.Mark,
                Description = r.Description,
                DriverId = r.DriverId,
                DriverName = r.Driver.Name,
                Author = new UserResponseDto
                {
                    Id = r.User.Id,
                    Name = r.User.Name,
                    Email = r.User.Email
                }
            })
            .ToListAsync();

        return Ok(reviews);
    }
}