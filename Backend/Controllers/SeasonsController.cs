using F1Journal.Data;
using F1Journal.Models;
using F1Journal.Dtos.Race;
using F1Journal.Dtos.Team;
using F1Journal.Dtos.Driver;
using F1Journal.Dtos.Season;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace F1Journal.Controllers;

[ApiController]
[Route("api/seasons")]
public class SeasonsController : ControllerBase
{
    private readonly AppDbContext _db;
    
    public SeasonsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetSeasons()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var seasonsFromDb = await _db.Seasons
            .Where(s => s.UserId == userId)
            .Include(s => s.Races)
            .Include(s => s.Teams)
            .ThenInclude(t => t.Drivers)
            .OrderByDescending(s => s.Year)
            .ToListAsync();

        var seasonsDto = seasonsFromDb.Select(season => new SeasonResponseDto
        {
            Id = season.Id,
            Year = season.Year,
        
            Races = season.Races.Select(race => new RaceResponseDto
            {
                Id = race.Id,
                Name = race.Name,
                CircuitName = race.CircuitName,
                RaceDate = race.RaceDate,
                SeasonId = race.SeasonId
            }).ToList(),

            Teams = season.Teams.Select(team => new TeamResponseDto
            {
                Id = team.Id,
                Name = team.Name,
                Base = team.Base,
                TeamPrincipal = team.TeamPrincipal,

                Drivers = team.Drivers.Select(driver => new DriverResponseDto
                {
                    Id = driver.Id,
                    Name = driver.Name,
                    Nationality = driver.Nationality,
                    DriverNumber = driver.DriverNumber
                }).ToList()
            }).ToList()
        }).ToList();
    
        return Ok(seasonsDto);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateSeason([FromBody] SeasonForCreationDto seasonDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var newSeason = new Season
        {
            Year = seasonDto.Year,
            UserId = userId,
        };
    
        _db.Seasons.Add(newSeason);
        await _db.SaveChangesAsync();
    
        return CreatedAtAction(nameof(GetSeasons), new { id = newSeason.Id }, newSeason);
    }
    
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteSeason(Guid id)
    {
        var UserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var seasonToDelete = await _db.Seasons.FirstOrDefaultAsync(season => season.UserId == UserId && season.Id == id);
        
        if (seasonToDelete == null) return NotFound();
        
        _db.Seasons.Remove(seasonToDelete);
        await _db.SaveChangesAsync();
        
        return NoContent();
    }
    
    [HttpGet("{seasonId}/drivers")]
    [Authorize]
    public async Task<ActionResult<List<DriverResponseDto>>> GetDriversForSeason(Guid seasonId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var teams = await _db.Teams
            .Where(t => t.SeasonId == seasonId && t.UserId == userId)
            .Include(t => t.Drivers)
            .ToListAsync();

        var drivers = teams
            .SelectMany(t => t.Drivers)
            .Select(d => new DriverResponseDto
            {
                Id = d.Id,
                Name = d.Name,
                Nationality = d.Nationality,
                DriverNumber = d.DriverNumber
            })
            .ToList();

        return Ok(drivers);
    }
}