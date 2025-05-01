namespace LearningPathGeneration_Backend.Models
{
    public class Email
    {
        public int Id { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public DateTime SentDateTime { get; set; }= DateTime.UtcNow;
        public List<Attachments>  Attachment { get; set; }

       
    }
    public class Attachments
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public byte[] Content { get; set; }
        public int EmailId { get; set; }
        public Email Email { get; set; }
    }
}
