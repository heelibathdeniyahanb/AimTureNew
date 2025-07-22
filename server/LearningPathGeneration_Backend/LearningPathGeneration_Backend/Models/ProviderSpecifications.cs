namespace LearningPathGeneration_Backend.Models
{
    public class ProviderSpecifications
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<AdvertiserProviderSpecification> AdvertisementProviderSpecifications { get; set; }
        public ICollection<AdSpecification> AdvertisementSpecifications { get; set; }
    }
}
