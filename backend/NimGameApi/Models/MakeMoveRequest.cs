public class MakeMoveRequest
{
    public int MatchId { get; set; }
    public int PlayerId { get; set; }
    public int Line { get; set; }           // qual linha (pilha)
    public int SticksRemoved { get; set; }  // quantos palitos retirar
}
