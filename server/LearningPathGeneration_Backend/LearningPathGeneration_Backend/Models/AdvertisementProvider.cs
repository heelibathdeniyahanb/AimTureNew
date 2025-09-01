namespace LearningPathGeneration_Backend.Models
{
    public class AdvertisementProvider
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? InstituteName { get; set; }
       
       public List<Advertisement> Advertisements { get; set; }
        public ICollection<AdvertiserProviderSpecification> AdvertisementProviderSpecifications { get; set; }

    }
}
