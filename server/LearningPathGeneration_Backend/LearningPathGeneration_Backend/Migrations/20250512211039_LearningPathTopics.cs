using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class LearningPathTopics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Topics",
                table: "LearningPathRequests");

            migrationBuilder.CreateTable(
                name: "LearningPathTopics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LearningPathRequestId = table.Column<int>(type: "integer", nullable: false),
                    TopicName = table.Column<string>(type: "text", nullable: false),
                    VideoLinks = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearningPathTopics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LearningPathTopics_LearningPathRequests_LearningPathRequest~",
                        column: x => x.LearningPathRequestId,
                        principalTable: "LearningPathRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LearningPathTopics_LearningPathRequestId",
                table: "LearningPathTopics",
                column: "LearningPathRequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LearningPathTopics");

            migrationBuilder.AddColumn<string>(
                name: "Topics",
                table: "LearningPathRequests",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
