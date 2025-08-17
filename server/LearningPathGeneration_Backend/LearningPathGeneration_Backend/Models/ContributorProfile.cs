namespace LearningPathGeneration_Backend.Models
{
    public class ContributorProfile
    {
        public int Id { get; set; }

        // Foreign key to User table
        public int UserId { get; set; }
        public User User { get; set; }

        // Contributor-specific details
        public string ExpertiseArea { get; set; }  // e.g., Mathematics, Writing, AI
        public string Qualifications { get; set; }
        public string Bio { get; set; }
        public string PortfolioUrl { get; set; }
        public string LinkedInUrl { get; set; }


    }
}
