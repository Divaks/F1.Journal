using F1Journal.Data;
using F1Journal.Models;
using F1Journal.Dtos.Race;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace F1Journal.Controllers;

[ApiController]
[Route("api/seasons/{seasonId}/races")]
public class RaceController : ControllerBase
{
    private readonly AppDbContext _db;
    
    public RaceController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<RaceResponseDto>>> GetRaces(Guid seasonId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var racesFromDb = await _db.Races
            .Where(r => r.SeasonId == seasonId && r.UserId == userId)
            .OrderBy(r => r.RaceDate)
            .ToListAsync();
    
        var racesDto = racesFromDb.Select(race => new RaceResponseDto
        {
            Id =  race.Id,
            Name = race.Name,
            CircuitName = race.CircuitName,
            RaceDate = race.RaceDate
        }).ToList();
    
        return Ok(racesDto);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateRace(Guid seasonId,[FromBody] RaceForCreationDto raceDto)
    {
        var UserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var newRace = new Race
        {
            Name = raceDto.Name,
            CircuitName = raceDto.CircuitName,
            RaceDate = DateTime.SpecifyKind(raceDto.RaceDate, DateTimeKind.Utc),
            SeasonId = seasonId,
            UserId = UserId
        };
        
        _db.Races.Add(newRace);
        await _db.SaveChangesAsync();
        
        var raceToReturn = new RaceResponseDto
        {
            Id = newRace.Id,
            Name = newRace.Name,
            CircuitName = newRace.CircuitName,
            RaceDate = newRace.RaceDate
        };
        
        return StatusCode(201, raceToReturn);
        
    }

    [HttpDelete("{raceId}")]
    [Authorize]
    public async Task<IActionResult> DeleteRace(Guid seasonId, Guid raceId)
    {
        var UserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var raceToDelete = await _db.Races.FirstOrDefaultAsync(race => race.UserId == UserId && race.SeasonId == seasonId && race.Id == raceId);
        
        if (raceToDelete == null) return NotFound();
        
        _db.Races.Remove(raceToDelete);
        await _db.SaveChangesAsync();
        
        return NoContent();
    }
}