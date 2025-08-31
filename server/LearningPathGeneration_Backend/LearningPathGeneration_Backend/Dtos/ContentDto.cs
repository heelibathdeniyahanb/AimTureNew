namespace LearningPathGeneration_Backend.Dtos
{
    public class ContentDto
    {
       
            public string Title { get; set; }
            public string Description { get; set; }
            public string? Url { get; set; }
            public int ContentTypeId { get; set; }
            public int ContributorId { get; set; }
            public List<int> SpecializationIds { get; set; }
            public IFormFile File { get; set; }   // 👈 add this
        

    }
}
