namespace LearningPathGeneration_Backend.Models
{
    public class LearningPathRequest
    {
        public int Id { get; set; }
        public string Goal { get; set; } = string.Empty;
        public string Deadline { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public int UserId { get; set; } // ✅ User who requested it
        public User User { get; set; }  // Optional: Navigation property
        public List<LearningPathTopic> Topics { get; set; } = new List<LearningPathTopic>();
        public DateTime CreatedAt { get; set; }
    }
}
