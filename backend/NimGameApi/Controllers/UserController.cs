using Microsoft.AspNetCore.Mvc;
using NimGameApi.Models;
using NimGameApi.Services;

namespace NimGameApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterDto dto)
        {
            var user = _userService.Register(dto.Username, dto.Password);
            return Ok(new { user.Id, user.Username });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto dto)
        {
            var user = _userService.Authenticate(dto.Username, dto.Password);
            if (user == null) return Unauthorized();

            // Aqui você deve gerar o JWT e retornar para o frontend (vou mostrar o helper logo)
            string token = "TOKEN_AQUI";

            return Ok(new { user.Id, user.Username, Token = token });
        }
    }

    public class UserRegisterDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UserLoginDto
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
