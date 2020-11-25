using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _009 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CarbohydateSugar",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Carbohydrate",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "EnergyKJ",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "EnergyKcal",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Fat",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Fibre",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Protein",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Salt",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "SaturateFat",
                table: "Products",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarbohydateSugar",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Carbohydrate",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "EnergyKJ",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "EnergyKcal",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Fat",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Fibre",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Protein",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Salt",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "SaturateFat",
                table: "Products");
        }
    }
}
