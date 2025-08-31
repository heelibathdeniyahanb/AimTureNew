using Google.Cloud.AIPlatform.V1;
using System.Text.Json.Serialization;


namespace LearningPathGeneration_Backend.Models
{
    public class ContentSpecializationcs
    {


        public int Id { get; set; }
        public string Name { get; set; } // e.g., "AI", "Web Development"
        [JsonIgnore]
        public ICollection<ContentSpecializationJoin> ContentSpecializations { get; set; } = new List<ContentSpecializationJoin>();
    }

        public class ContentType
        {
            public int Id { get; set; }
            public string Name { get; set; } // e.g., "Video", "PDF", "Article"
        [JsonIgnore]
            public ICollection<Content> Contents { get; set; }
        }

    }

