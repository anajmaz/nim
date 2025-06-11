using System.ComponentModel.DataAnnotations;

namespace NimGameApi.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        public int Wins { get; set; }
        public int Losses { get; set; }
    }
}
