namespace LearningPathGeneration_Backend.Dtos
{
    public class AdvertisementDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public string ImageUrl { get; set; }
        public int AdvertisementProviderId { get; set; }
        public string ProviderName { get; set; }

        public int CreatedUserId { get; set; }
        public string CreatedUserName { get; set; }


    }

    public class CreateAdvertisementDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image { get; set; }
        public int AdvertisementProviderId { get; set; }  
        public int CreatedUserId { get; set; }
        public List<int> SpecificationIds { get; set; }

    }

    public class UpdateAdvertisementDto
    {
        public string Title { get; set; }
        public string? Description { get; set; }
        public IFormFile? Image{ get; set; }
    }

}
