namespace LearningPathGeneration_Backend.Models
{
    public class AdvertiserProviderSpecification
    {
      
            public int AdvertisementProviderId { get; set; }
            public AdvertisementProvider AdvertisementProvider { get; set; }

            public int SpecificationId { get; set; }
            public ProviderSpecifications Specification { get; set; }
     

    }
}
