using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class CreatedUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "Advertisements");

            migrationBuilder.AddColumn<int>(
                name: "CreatedUserId",
                table: "Advertisements",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedUserId",
                table: "Advertisements");

            migrationBuilder.AddColumn<string>(
                name: "CreatedUser",
                table: "Advertisements",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
