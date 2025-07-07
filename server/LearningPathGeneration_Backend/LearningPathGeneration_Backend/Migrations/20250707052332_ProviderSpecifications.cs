using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class ProviderSpecifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InstituteName",
                table: "AdvertisementProviders",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_CreatedUserId",
                table: "Advertisements",
                column: "CreatedUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Users_CreatedUserId",
                table: "Advertisements",
                column: "CreatedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Users_CreatedUserId",
                table: "Advertisements");

            migrationBuilder.DropIndex(
                name: "IX_Advertisements_CreatedUserId",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "InstituteName",
                table: "AdvertisementProviders");
        }
    }
}
