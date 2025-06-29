﻿namespace LearningPathGeneration_Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }

        public ICollection<LearningPathRequest> LearningPaths { get; set; } = new List<LearningPathRequest>();
    }

}

