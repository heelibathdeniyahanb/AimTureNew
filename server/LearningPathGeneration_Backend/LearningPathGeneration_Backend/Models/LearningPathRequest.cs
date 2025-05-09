﻿namespace LearningPathGeneration_Backend.Models
{
    public class LearningPathRequest
    {
        public int Id { get; set; }
        public string Goal { get; set; } = string.Empty;
        public string Deadline { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public List<string> Topics { get; set; } = new List<string>();
        public DateTime CreatedAt { get; set; }
    }
}
