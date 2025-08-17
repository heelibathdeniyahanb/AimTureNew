using Google.Cloud.AIPlatform.V1;

namespace LearningPathGeneration_Backend.Models
{
    public class ContentSpecializationcs
    {
      
        
            public int Id { get; set; }
            public string Name { get; set; } // e.g., "AI", "Web Development"
            public ICollection<ContributorProfile> Contributors { get; set; }
            public ICollection<Content> Contents { get; set; }
        }

        public class ContentType
        {
            public int Id { get; set; }
            public string Name { get; set; } // e.g., "Video", "PDF", "Article"
            public ICollection<Content> Contents { get; set; }
        }

    }

