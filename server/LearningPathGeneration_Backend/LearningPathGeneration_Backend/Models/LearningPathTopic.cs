namespace LearningPathGeneration_Backend.Models
{
    public class LearningPathTopic
    {
        public int Id { get; set; }
        public int LearningPathRequestId { get; set; }  // Foreign Key
        public string TopicName { get; set; } = string.Empty;

        // Store YouTube links as List<string>, but save them as JSON
        public List<string> VideoLinks { get; set; } = new List<string>();

        // Navigation Property
        public LearningPathRequest LearningPathRequest { get; set; }
    }
}
