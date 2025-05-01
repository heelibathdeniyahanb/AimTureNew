using System.ComponentModel.DataAnnotations;

namespace LearningPathGeneration_Backend.Dtos
{
    public class RegisterDto
    {
        public string FirstName {  get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        
        public string MobileNo { get; set; }
        public string Role {  get; set; }
    }
}
