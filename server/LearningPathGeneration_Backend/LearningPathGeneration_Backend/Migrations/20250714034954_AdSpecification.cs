using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningPathGeneration_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AdSpecification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Advertisements",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "AdvertisemnetSpecifications",
                columns: table => new
                {
                    AdvertisementId = table.Column<int>(type: "integer", nullable: false),
                    SpecificationId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdvertisemnetSpecifications", x => new { x.AdvertisementId, x.SpecificationId });
                    table.ForeignKey(
                        name: "FK_AdvertisemnetSpecifications_Advertisements_AdvertisementId",
                        column: x => x.AdvertisementId,
                        principalTable: "Advertisements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdvertisemnetSpecifications_ProviderSpecifications_Specific~",
                        column: x => x.SpecificationId,
                        principalTable: "ProviderSpecifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdvertisemnetSpecifications_SpecificationId",
                table: "AdvertisemnetSpecifications",
                column: "SpecificationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdvertisemnetSpecifications");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Advertisements",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
