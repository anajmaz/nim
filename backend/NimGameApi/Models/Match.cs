using System.ComponentModel.DataAnnotations;

namespace NimGameApi.Models
{
    public class Match
    {
        public int Id { get; set; }
        public int Player1Id { get; set; }
        public int? Player2Id { get; set; } // pode ser null (vs IA)
        public int CurrentSticks { get; set; } = 21;
        public int? CurrentPlayerId { get; set; }

        public int? WinnerId { get; set; }
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? FinishedAt { get; set; }
        public string GameState { get; set; } = null!;
    }
}
