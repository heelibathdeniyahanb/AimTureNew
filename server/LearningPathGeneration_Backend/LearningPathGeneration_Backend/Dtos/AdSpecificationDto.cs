namespace LearningPathGeneration_Backend.Dtos
{
    public class AdSpecificationDto
    {
       
            public int Id { get; set; }
            public string Name { get; set; }
        }

        public class CreateAdSpecificationDto
        {
            public string Name { get; set; }
        }

        public class UpdateAdSpecificationDto
        {
            public string Name { get; set; }
        }
    }

