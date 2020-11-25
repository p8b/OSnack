using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _010 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_Name",
                table: "Products");

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
                name: "NetQuantity",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "NutritionalInfo",
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

            migrationBuilder.AddColumn<int>(
                name: "UnitQuantity",
                table: "Products",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "NutritionalInfos",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PerGram = table.Column<int>(nullable: false),
                    EnergyKJ = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    EnergyKcal = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Fat = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    SaturateFat = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Carbohydrate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    carbohydrateSugar = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Fibre = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Protein = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Salt = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ProductId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NutritionalInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NutritionalInfos_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_NutritionalInfos_ProductId",
                table: "NutritionalInfos",
                column: "ProductId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NutritionalInfos");

            migrationBuilder.DropColumn(
                name: "UnitQuantity",
                table: "Products");

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

            migrationBuilder.AddColumn<int>(
                name: "NetQuantity",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "NutritionalInfo",
                table: "Products",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Products_Name",
                table: "Products",
                column: "Name",
                unique: true);
        }
    }
}
