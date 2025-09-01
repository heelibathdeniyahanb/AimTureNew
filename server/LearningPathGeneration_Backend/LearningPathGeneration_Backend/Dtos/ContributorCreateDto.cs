namespace LearningPathGeneration_Backend.Dtos
{
    public class ContributorCreateDto
    {
        public int UserId { get; set; } // FK to User
        public string ExpertiseArea { get; set; }  // e.g., Mathematics, Writing, AI
        public string Qualifications { get; set; }
        public string Bio { get; set; }
        public string PortfolioUrl { get; set; }
        public string LinkedInUrl { get; set; }
    }
}
