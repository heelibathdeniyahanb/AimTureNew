namespace LearningPathGeneration_Backend.Dtos
{
    public class AdSpecificationDto
    {

        public int AdvertisementId { get; set; }
        public int SpecificationId { get; set; }
        public string SpecificationName { get; set; }

    }

    public class CreateAdSpecificationDto
        {
        public int AdvertisementId { get; set; }
        public int SpecificationId { get; set; }
    }

        public class UpdateAdSpecificationDto
        {
            public string Name { get; set; }
        }
    }

