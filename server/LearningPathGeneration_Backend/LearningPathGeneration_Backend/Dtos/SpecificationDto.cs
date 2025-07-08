namespace LearningPathGeneration_Backend.Dtos
{
    public class SpecificationDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateSpecificationDto
    {
        public string Name { get; set; }
    }

    public class UpdateSpecificationDto
    {
        public string Name { get; set; }
    }
}
