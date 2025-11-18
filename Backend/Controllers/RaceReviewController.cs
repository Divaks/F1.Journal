using F1Journal.Data;
using F1Journal.Models;
using F1Journal.Dtos.User;
using F1Journal.Dtos.Review;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace F1Journal.Controllers;

[ApiController]
[Route("api/reviews")]
public class RaceReviewController : ControllerBase
{
    private readonly AppDbContext _db;
    
    public RaceReviewController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("race/{raceId:guid}")]
    public async Task<IActionResult> GetReviewsForRace(Guid raceId)
    {
        var reviewsFromDb = await _db.RaceReviews
            .Where(r => r.RaceId == raceId) 
            .Include(r => r.User) 
            .ToListAsync();
            
        var reviewsDto = reviewsFromDb.Select(review => new RaceReviewResponseDto
        {
            Id = review.Id,
            Mark = review.Mark,
            Description = review.Description,
            Author = new UserResponseDto
            {
                Id = review.User.Id,
                Name = review.User.Name,
                Email = review.User.Email
            }
        }).ToList();
        
        return Ok(reviewsDto);
    }
    
    [HttpPost("race")]
    [Authorize]
    public async Task<IActionResult> CreateRaceReview([FromBody] RaceReviewForCreationDto reviewDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var newReview = new RaceReview
        {
            Mark = reviewDto.Mark,
            Description = reviewDto.Description,
            UserId = userId,
            RaceId = reviewDto.RaceId
        };

        _db.RaceReviews.Add(newReview);
        await _db.SaveChangesAsync();

        var author = await _db.Users.FindAsync(newReview.UserId);

        var reviewToReturn = new RaceReviewResponseDto
        {
            Id = newReview.Id,
            Mark = newReview.Mark,
            Description = newReview.Description,
            Author = new UserResponseDto
            {
                Id = author.Id,
                Name = author.Name,
                Email = author.Email
            }
        };

        return StatusCode(201, reviewToReturn);
    }
    
    [HttpPost("driver")]
    [Authorize]
    public async Task<IActionResult> CreateDriverReview([FromBody] DriverPerformanceReviewForCreationDto driverReviewDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var newReview = new DriverPerformanceReview
        {
            Mark = driverReviewDto.Mark,
            Description = driverReviewDto.Description,
            DriverId = driverReviewDto.DriverId,
            UserId = userId,
            RaceId = driverReviewDto.RaceId
        };

        _db.DriverPerformanceReviews.Add(newReview);
        await _db.SaveChangesAsync();

        var author = await _db.Users.FindAsync(newReview.UserId);

        var reviewToReturn = new DriverPerformanceReviewResponseDto
        {
            Id = newReview.Id,
            Mark = newReview.Mark,
            Description = newReview.Description,
            DriverId = driverReviewDto.DriverId,
            RaceId = driverReviewDto.RaceId,
            Author = new UserResponseDto
            {
                Id = author.Id,
                Name = author.Name,
                Email = author.Email
            }
        };

        return StatusCode(201, reviewToReturn);
    }
    
    [HttpPost("team")]
    [Authorize]
    public async Task<IActionResult> CreateTeamReview([FromBody] TeamPerformanceReviewForCreationDto teamReviewDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var newReview = new TeamPerformanceReview
        {
            Mark = teamReviewDto.Mark,
            Description = teamReviewDto.Description,
            TeamId = teamReviewDto.TeamId,
            UserId = userId,
            RaceId = teamReviewDto.RaceId
        };

        _db.TeamPerformanceReviews.Add(newReview);
        await _db.SaveChangesAsync();

        var author = await _db.Users.FindAsync(newReview.UserId);

        var reviewToReturn = new TeamPerformanceReviewResponseDto
        {
            Id = newReview.Id,
            Mark = newReview.Mark,
            Description = newReview.Description,
            TeamId = teamReviewDto.TeamId,
            RaceId = teamReviewDto.RaceId,
            Author = new UserResponseDto
            {
                Id = author.Id,
                Name = author.Name,
                Email = author.Email
            }
        };

        return StatusCode(201, reviewToReturn);
    }
    
    [HttpDelete("race/{reviewId}")]
    [Authorize]
    public async Task<IActionResult> DeleteRaceReview(Guid reviewId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var reviewToDelete = await _db.RaceReviews
            .FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);

        if (reviewToDelete == null)
        {
            return NotFound(); 
        }
        
        _db.RaceReviews.Remove(reviewToDelete);
        await _db.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpDelete("driver/{reviewId}")]
    [Authorize]
    public async Task<IActionResult> DeleteDriverReview(Guid reviewId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var reviewToDelete = await _db.DriverPerformanceReviews
            .FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);

        if (reviewToDelete == null) return NotFound();
        
        _db.DriverPerformanceReviews.Remove(reviewToDelete);
        await _db.SaveChangesAsync();
        return NoContent();

    }

    [HttpDelete("team/{reviewId}")]
    [Authorize]
    public async Task<IActionResult> DeleteTeamReview(Guid reviewId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var reviewToDelete = await _db.TeamPerformanceReviews
            .FirstOrDefaultAsync(r => r.Id == reviewId && r.UserId == userId);

        if (reviewToDelete == null) return NotFound();

        _db.TeamPerformanceReviews.Remove(reviewToDelete);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}