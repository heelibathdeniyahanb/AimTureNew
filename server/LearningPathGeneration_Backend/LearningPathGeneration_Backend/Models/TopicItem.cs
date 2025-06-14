namespace LearningPathGeneration_Backend.Models
{
    public class TopicItem
    {
        public int Id { get; set; }
        public string TopicName { get; set; } = string.Empty;
        public List<string> VideoLinks { get; set; } = new List<string>();
    }
}
