using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class join : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentSpecializationJoin_ContentSpecializations_ContentSpe~",
                table: "ContentSpecializationJoin");

            migrationBuilder.DropForeignKey(
                name: "FK_ContentSpecializationJoin_Contents_ContentId",
                table: "ContentSpecializationJoin");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContentSpecializationJoin",
                table: "ContentSpecializationJoin");

            migrationBuilder.RenameTable(
                name: "ContentSpecializationJoin",
                newName: "ContentSpecializationJoins");

            migrationBuilder.RenameIndex(
                name: "IX_ContentSpecializationJoin_ContentSpecializationId",
                table: "ContentSpecializationJoins",
                newName: "IX_ContentSpecializationJoins_ContentSpecializationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContentSpecializationJoins",
                table: "ContentSpecializationJoins",
                columns: new[] { "ContentId", "ContentSpecializationId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ContentSpecializationJoins_ContentSpecializations_ContentSp~",
                table: "ContentSpecializationJoins",
                column: "ContentSpecializationId",
                principalTable: "ContentSpecializations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContentSpecializationJoins_Contents_ContentId",
                table: "ContentSpecializationJoins",
                column: "ContentId",
                principalTable: "Contents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContentSpecializationJoins_ContentSpecializations_ContentSp~",
                table: "ContentSpecializationJoins");

            migrationBuilder.DropForeignKey(
                name: "FK_ContentSpecializationJoins_Contents_ContentId",
                table: "ContentSpecializationJoins");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContentSpecializationJoins",
                table: "ContentSpecializationJoins");

            migrationBuilder.RenameTable(
                name: "ContentSpecializationJoins",
                newName: "ContentSpecializationJoin");

            migrationBuilder.RenameIndex(
                name: "IX_ContentSpecializationJoins_ContentSpecializationId",
                table: "ContentSpecializationJoin",
                newName: "IX_ContentSpecializationJoin_ContentSpecializationId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContentSpecializationJoin",
                table: "ContentSpecializationJoin",
                columns: new[] { "ContentId", "ContentSpecializationId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ContentSpecializationJoin_ContentSpecializations_ContentSpe~",
                table: "ContentSpecializationJoin",
                column: "ContentSpecializationId",
                principalTable: "ContentSpecializations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ContentSpecializationJoin_Contents_ContentId",
                table: "ContentSpecializationJoin",
                column: "ContentId",
                principalTable: "Contents",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
