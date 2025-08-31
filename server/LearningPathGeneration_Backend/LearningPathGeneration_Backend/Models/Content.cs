using System.Text.Json.Serialization;

namespace LearningPathGeneration_Backend.Models
{
    public class Content
    {
        
            public int Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string? Url { get; set; }

            // Foreign keys
            public int ContributorId { get; set; }
            public ContributorProfile Contributor { get; set; }
        [JsonIgnore]
        public ICollection<ContentSpecializationJoin> ContentSpecializations { get; set; } = new List<ContentSpecializationJoin>();

        public int ContentTypeId { get; set; }
            public ContentType ContentType { get; set; }

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public bool IsApproved { get; set; } = false; // Admin approval
        }

    
}
