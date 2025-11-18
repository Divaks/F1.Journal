using Npgsql;
using F1Journal.Data;
using F1Journal.Models;
using F1Journal.Dtos.Team;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace F1Journal.Controllers;

[ApiController]
[Route("api/seasons/{seasonId}/teams")]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _db;
    
    public TeamsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateTeam(Guid seasonId, [FromBody] TeamForCreationDto teamDto)
    {
        var UserId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var newTeam = new Team
        {
            Name = teamDto.Name,
            Base = teamDto.Base,
            TeamPrincipal = teamDto.TeamPrincipal,
            SeasonId = seasonId,
            UserId = UserId
        };
        
        try
        {
            _db.Teams.Add(newTeam);
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
            {
                return BadRequest("Команда з такою назвою вже існує в цьому сезоні.");
            }
            throw;
        }

        var teamToReturn = new TeamResponseDto
        {
            Id = newTeam.Id,
            Name = newTeam.Name,
            Base = newTeam.Base,
            TeamPrincipal = newTeam.TeamPrincipal,
        };

        return StatusCode(201, teamToReturn);        
    }
    
    [HttpGet]
    [Authorize]
    public async Task<ActionResult> GetTeamsBySeason(Guid seasonId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var teams = await _db.Teams
            .Where(t => t.SeasonId == seasonId && t.UserId == userId)
            .Select(t => new 
            {
                Id = t.Id,
                Name = t.Name
            })
            .ToListAsync();

        return Ok(teams);
    }

    [HttpDelete("{teamId}")]
    [Authorize]
    public async Task<IActionResult> DeleteTeam(Guid seasonId, Guid teamId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    
        var teamToDelete = await _db.Teams.FirstOrDefaultAsync(team => team.UserId == userId && team.SeasonId == seasonId && team.Id == teamId);

        if (teamToDelete == null) return NotFound();

        _db.Teams.Remove(teamToDelete);
        await _db.SaveChangesAsync();
    
        return NoContent();
    }
}