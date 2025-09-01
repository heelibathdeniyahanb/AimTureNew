namespace LearningPathGeneration_Backend.Interfaces
{
    
        
        public interface IGoogleAiService
        {
            Task<string> AskQuestionAsync(string question);
        }
    
}

