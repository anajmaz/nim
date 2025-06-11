using Microsoft.AspNetCore.Mvc;

namespace NimGameApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API NimGame rodando!");
        }
    }
}
