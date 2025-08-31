using System.Text.Json.Serialization;

namespace LearningPathGeneration_Backend.Models
   
{
    public class ContentSpecializationJoin
    {
        public int ContentId { get; set; }
    [JsonIgnore]
    public Content Content { get; set; }

        public int ContentSpecializationId { get; set; }
        [JsonIgnore]
        public ContentSpecializationcs ContentSpecialization { get; set; }
    }
}
