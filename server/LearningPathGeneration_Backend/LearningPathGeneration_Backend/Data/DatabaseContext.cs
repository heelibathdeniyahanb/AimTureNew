using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LearningPathGeneration_Backend.Data
{
    public class DatabaseContext:DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options):base(options)

        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<AnalyzeRequest> AnalyzeRequests { get; set; }
        public DbSet<LearningPathRequest> LearningPathRequests { get; set; }
        public DbSet<Email>Emails { get; set; }
        public DbSet<Attachments>Attachments { get; set; }
        public DbSet<LearningPathTopic> LearningPathTopics { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Email Attachments Configuration
            modelBuilder.Entity<Email>()
               .HasMany(e => e.Attachment)
               .WithOne(a => a.Email)
               .HasForeignKey(a => a.EmailId);

            // ✅ Configure LearningPathRequest and Topics relationship
            modelBuilder.Entity<LearningPathRequest>()
                .HasMany(lp => lp.Topics)
                .WithOne(t => t.LearningPathRequest)
                .HasForeignKey(t => t.LearningPathRequestId);

            // ✅ Configure VideoLinks to be saved as JSON
            modelBuilder.Entity<LearningPathTopic>()
               .Property(e => e.VideoLinks)
               .HasConversion(
                   v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                   v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null)
               );

            base.OnModelCreating(modelBuilder);
        }



    }
}
