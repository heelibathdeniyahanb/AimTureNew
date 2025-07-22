namespace LearningPathGeneration_Backend.Models
{
    public class AdSpecification
    {
        public int AdvertisementId { get; set; }
        public Advertisement Advertisement { get; set; }

        public int SpecificationId { get; set; }
        public ProviderSpecifications Specification { get; set; }
    }
}
