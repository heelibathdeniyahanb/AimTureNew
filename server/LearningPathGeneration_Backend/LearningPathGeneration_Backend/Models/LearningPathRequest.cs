namespace LearningPathGeneration_Backend.Models
{
    public class LearningPathRequest
    {
        public int Id { get; set; }
        public string Goal { get; set; } = string.Empty;
        public string Deadline { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string Topics { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
