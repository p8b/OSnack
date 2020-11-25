using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _008 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NutritionalInfo",
                table: "Products",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OriginalImagePath",
                table: "Products",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Status",
                table: "Products",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NutritionalInfo",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OriginalImagePath",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Products");
        }
    }
}
