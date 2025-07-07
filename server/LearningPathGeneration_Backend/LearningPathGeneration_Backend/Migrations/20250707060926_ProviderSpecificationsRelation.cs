using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class ProviderSpecificationsRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProviderSpecifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderSpecifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AdvertiserProviderSpecifications",
                columns: table => new
                {
                    AdvertisementProviderId = table.Column<int>(type: "integer", nullable: false),
                    SpecificationId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdvertiserProviderSpecifications", x => new { x.AdvertisementProviderId, x.SpecificationId });
                    table.ForeignKey(
                        name: "FK_AdvertiserProviderSpecifications_AdvertisementProviders_Adv~",
                        column: x => x.AdvertisementProviderId,
                        principalTable: "AdvertisementProviders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdvertiserProviderSpecifications_ProviderSpecifications_Spe~",
                        column: x => x.SpecificationId,
                        principalTable: "ProviderSpecifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdvertiserProviderSpecifications_SpecificationId",
                table: "AdvertiserProviderSpecifications",
                column: "SpecificationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdvertiserProviderSpecifications");

            migrationBuilder.DropTable(
                name: "ProviderSpecifications");
        }
    }
}
