using Npgsql;
using F1Journal.Data;
using F1Journal.Models;
using F1Journal.Dtos.Driver;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch; 

namespace F1Journal.Controllers;

[ApiController]
[Route("api/teams/{teamId}/drivers")]
[Authorize]
public class DriverController : ControllerBase
{
    private readonly AppDbContext _db;
    
    public DriverController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost] 
    public async Task<ActionResult<DriverResponseDto>> CreateDriver(Guid teamId, [FromBody] DriverForCreationDto driverDto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var teamExists = await _db.Teams.AnyAsync(t => t.Id == teamId && t.UserId == userId);
        if (!teamExists)
        {
            return Forbid("Ви не можете додати пілота до чужої команди.");
        }
        
        var newDriver = new Driver
        {
            Name = driverDto.Name,
            Nationality = driverDto.Nationality,
            DriverNumber = driverDto.DriverNumber,
            TeamId = teamId,
            UserId = userId 
        };
        
        try
        {
            _db.Drivers.Add(newDriver);
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex) 
        {
            if (ex.InnerException is PostgresException pgEx && pgEx.SqlState == "23505")
            {
                return BadRequest("Пілот з таким номером вже існує.");
            }
            throw;
        }
    
        var driverToReturn = new DriverResponseDto
        {
            Id = newDriver.Id,
            Name = newDriver.Name,
            Nationality = newDriver.Nationality,
            DriverNumber = newDriver.DriverNumber
        };
        return StatusCode(201, driverToReturn);
    }
    
    [HttpDelete("{driverId}")] 
    public async Task<IActionResult> DeleteDriver(Guid teamId, Guid driverId)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var driverToDelete = await _db.Drivers
            .FirstOrDefaultAsync(d => d.Id == driverId && d.TeamId == teamId && d.UserId == userId);
        
        if (driverToDelete == null) return NotFound();
        
        _db.Drivers.Remove(driverToDelete);
        await _db.SaveChangesAsync();
        
        return NoContent();
    }

    [HttpPatch("{driverId}")]
    public async Task<IActionResult> PatchDriver(Guid teamId, Guid driverId, [FromBody] JsonPatchDocument<Driver> patchDoc)
    {
        if (patchDoc == null)
        {
            return BadRequest("Patch-документ не може бути пустим.");
        }
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        
        var driverFromDb = await _db.Drivers
            .FirstOrDefaultAsync(d => d.Id == driverId && d.TeamId == teamId && d.UserId == userId);
        
        if (driverFromDb == null)
        {
            return NotFound("Гонщика з таким ID не знайдено.");
        }
        
        var errors = new List<JsonPatchError>();
        
        patchDoc.ApplyTo(driverFromDb, errors.Add);
        
        if (errors.Count > 0)
        {
            foreach (var error in errors)
            {
                ModelState.AddModelError("JsonPatchError", error.ErrorMessage);
            }
            return BadRequest(ModelState);
        }
        
        await _db.SaveChangesAsync();
        return NoContent();
    }
}