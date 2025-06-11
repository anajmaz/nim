using Microsoft.AspNetCore.Mvc;
using NimGameApi.Data;
using NimGameApi.Models;
using System.Text.Json;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class MatchController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MatchController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpPost("player-move")]
    public IActionResult PlayerMove([FromBody] MakeMoveRequest request)
    {
        var match = _context.Matches.Find(request.MatchId);
        if (match == null || match.WinnerId != 0)
            return NotFound("Partida não encontrada ou já finalizada.");

        if (match.CurrentPlayerId != request.PlayerId)
            return BadRequest("Não é a vez deste jogador.");

        var piles = JsonSerializer.Deserialize<List<int>>(match.GameState)!;

        if (request.Line < 0 || request.Line >= piles.Count)
            return BadRequest("Linha inválida.");

        if (request.SticksRemoved <= 0 || request.SticksRemoved > piles[request.Line])
            return BadRequest("Quantidade inválida de palitos.");

        // Atualiza a pilha removendo os palitos
        piles[request.Line] -= request.SticksRemoved;

        bool gameOver = piles.All(p => p == 0);
        if (gameOver)
        {
            match.WinnerId = request.PlayerId;
        }
        else
        {
            if (match.Player2Id == 0)
                match.CurrentPlayerId = 0; // vez da IA
            else
                match.CurrentPlayerId = (request.PlayerId == match.Player1Id) ? match.Player2Id : match.Player1Id;
        }

        match.GameState = JsonSerializer.Serialize(piles);
        _context.SaveChanges();

        return Ok(match);
    }
}
