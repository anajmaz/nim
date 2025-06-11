namespace NimGameApi.Models
{
    public class CreateMatchRequest
    {
        public int Player1Id { get; set; }
        public int Player2Id { get; set; }
        public string GameState { get; set; } = null!;
    }
}
