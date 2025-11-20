using Microsoft.AspNetCore.Mvc;

namespace F1Journal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet] 
    public IActionResult Get()
    {
        return Ok("Alive");
    }
}