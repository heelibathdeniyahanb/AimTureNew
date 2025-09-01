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
            public IFormFile? File { get; set; }   // 👈 add this
        

    }

    public class ContentResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string? Url { get; set; }
        public string FileUrl { get; set; }
        public int ContentTypeId { get; set; }
        public int ContributorId { get; set; }
        public string ContentTypeName { get; set; }  // 👈 from ContentType table
        public string ContributorName { get; set; }  // 👈 from Contributor table
        public List<string> SpecializationNames { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ViewCount { get; set; }
        public int LikeCount { get; set; }
        public bool isApproved { get; set; }
    }
}
