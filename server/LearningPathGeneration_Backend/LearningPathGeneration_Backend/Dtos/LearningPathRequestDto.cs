using LearningPathGeneration_Backend.Models;

namespace LearningPathGeneration_Backend.Dtos
{
    public class LearningPathRequestDto
    {
        public string? Goal { get; set; }
        public string? Deadline { get; set; }
        public string? Level { get; set; }
        public int UserId { get; set; } // ✅ User who requested it
       
    }
}
