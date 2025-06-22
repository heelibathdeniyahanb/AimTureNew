using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UserPathRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "LearningPathRequests",
                type: "integer",
                nullable:true,
                defaultValue: 14);

            migrationBuilder.CreateIndex(
                name: "IX_LearningPathRequests_UserId",
                table: "LearningPathRequests",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LearningPathRequests_Users_UserId",
                table: "LearningPathRequests",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LearningPathRequests_Users_UserId",
                table: "LearningPathRequests");

            migrationBuilder.DropIndex(
                name: "IX_LearningPathRequests_UserId",
                table: "LearningPathRequests");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LearningPathRequests");
        }
    }
}
