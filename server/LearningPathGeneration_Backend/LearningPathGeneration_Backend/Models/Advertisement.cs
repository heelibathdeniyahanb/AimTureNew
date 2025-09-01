namespace LearningPathGeneration_Backend.Models
{
    public class Advertisement
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int CreatedUserId { get; set; }
        public User CreatedUser { get; set; }

        public ICollection<AdSpecification> AdvertisementSpecifications { get; set; }


        //// ✅ Foreign key for AdvertisementProvider
        public int AdvertisementProviderId { get; set; }

        //// ✅ Navigation property
      public AdvertisementProvider AdvertisementProvider { get; set; }

    }
}
