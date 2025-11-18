[Route("api/test")]
public class TestController : Controller
{
    [HttpGet]
    public IActionResult Get() => Ok("Backend is alive");
}
