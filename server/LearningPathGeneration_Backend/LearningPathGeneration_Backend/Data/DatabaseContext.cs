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
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
        public DbSet<Advertisement> Advertisements { get; set; }
        public DbSet<AdvertisementProvider> AdvertisementProviders { get; set; }
        public DbSet<ProviderSpecifications> ProviderSpecifications { get; set; }
        public DbSet<AdvertiserProviderSpecification> AdvertiserProviderSpecifications { get; set; }
        public DbSet<AdSpecification>AdvertisemnetSpecifications { get; set; }
       




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

            // One User -> Many LearningPathRequests
            modelBuilder.Entity<User>()
                .HasMany(u => u.LearningPaths)
                .WithOne(lp => lp.User)
                .HasForeignKey(lp => lp.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Optional: cascade delete if user is removed

          modelBuilder.Entity<Advertisement>()
             .HasOne(a => a.AdvertisementProvider)
           .WithMany(p => p.Advertisements)
           .HasForeignKey(a => a.AdvertisementProviderId)
           .OnDelete(DeleteBehavior.Cascade)
        .HasConstraintName("fk_ad_adprovider");

            modelBuilder.Entity<AdvertiserProviderSpecification>()
        .HasKey(x => new { x.AdvertisementProviderId, x.SpecificationId });

            modelBuilder.Entity<AdvertiserProviderSpecification>()
                .HasOne(x => x.AdvertisementProvider)
                .WithMany(p => p.AdvertisementProviderSpecifications)
                .HasForeignKey(x => x.AdvertisementProviderId);

            modelBuilder.Entity<AdvertiserProviderSpecification>()
                .HasOne(x => x.Specification)
                .WithMany(s => s.AdvertisementProviderSpecifications)
                .HasForeignKey(x => x.SpecificationId);

            modelBuilder.Entity<AdSpecification>()
       .HasKey(x => new { x.AdvertisementId, x.SpecificationId });

            modelBuilder.Entity<AdSpecification>()
                .HasOne(x => x.Advertisement)
                .WithMany(p => p.AdvertisementSpecifications)
                .HasForeignKey(x => x.AdvertisementId);

            modelBuilder.Entity<AdSpecification>()
                .HasOne(x => x.Specification)
                .WithMany(s => s.AdvertisementSpecifications)
                .HasForeignKey(x => x.SpecificationId);

            base.OnModelCreating(modelBuilder);
        }



    }
}
