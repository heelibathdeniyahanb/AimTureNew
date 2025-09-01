using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class RelationWithAdvertismenetAndProvider : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AdvertisementProviderId",
                table: "Advertisements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CreatedUser",
                table: "Advertisements",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_AdvertisementProviderId",
                table: "Advertisements",
                column: "AdvertisementProviderId");

            migrationBuilder.AddForeignKey(
                name: "fk_ad_adprovider",
                table: "Advertisements",
                column: "AdvertisementProviderId",
                principalTable: "AdvertisementProviders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_ad_adprovider",
                table: "Advertisements");

            migrationBuilder.DropIndex(
                name: "IX_Advertisements_AdvertisementProviderId",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "AdvertisementProviderId",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "Advertisements");
        }
    }
}
