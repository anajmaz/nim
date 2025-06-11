using Microsoft.AspNetCore.Mvc;
using NimGameApi.Data;
using NimGameApi.Models;

[ApiController]
[Route("api/[controller]")]
public class MatchController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MatchController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("create")]
    public IActionResult CreateMatch([FromBody] CreateMatchRequest request)
    {
        var match = new Match
        {
            Player1Id = request.Player1Id,
            Player2Id = request.Player2Id,
            CurrentPlayerId = request.Player1Id,
            GameState = "[3,4,5]", // exemplo de pilhas
            WinnerId = 0
        };

        _context.Matches.Add(match);
        _context.SaveChanges();
        return Ok(match);
    }

    [HttpGet("{id}")]
    public IActionResult GetMatch(int id)
    {
        var match = _context.Matches.Find(id);
        if (match == null) return NotFound();
        return Ok(match);
    }

    // Implemente mais endpoints para atualizar o jogo, fazer jogadas, etc.
}
