namespace LearningPathGeneration_Backend.Dtos
{
    public class ContributorUpdateDto
    {
        public int Id { get; set; }  // required to find contributor
        public string ExpertiseArea { get; set; }
        public string Qualifications { get; set; }
        public string Bio { get; set; }
        public string PortfolioUrl { get; set; }
        public string LinkedInUrl { get; set; }
    }
}
