using LearningPathGeneration_Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace LearningPathGeneration_Backend.Data
{
    public class DatabaseContext:DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options):base(options)

        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<AnalyzeRequest> AnalyzeRequests { get; set; }
        public DbSet<Email>Emails { get; set; }
        public DbSet<Attachments>Attachments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Email Attachments Configuration
            modelBuilder.Entity<Email>()
               .HasMany(e => e.Attachment)
               .WithOne(a => a.Email)
               .HasForeignKey(a => a.EmailId);

            base.OnModelCreating(modelBuilder);
        }



    }
}
