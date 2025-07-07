namespace LearningPathGeneration_Backend.Dtos
{
    public class AdvertisemntProviderDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string InstituteName { get; set; }

        public List<SpecificationDto> Specifications { get; set; }
    }

    public class CreateAdvertisementProviderDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string InstituteName { get; set; }
        public List<int> SpecificationIds { get; set; }
    }

}
