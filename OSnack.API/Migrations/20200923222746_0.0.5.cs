using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _005 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DeliveryOptionId",
                table: "Orders",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "DeliveryOption",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(7,2)", nullable: false),
                    MinimumOrderTotal = table.Column<decimal>(type: "decimal(7,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeliveryOption", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    Description = table.Column<string>(nullable: false),
                    HtmlPath = table.Column<string>(nullable: false),
                    DesignPath = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTemplates", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_DeliveryOptionId",
                table: "Orders",
                column: "DeliveryOptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_DeliveryOption_DeliveryOptionId",
                table: "Orders",
                column: "DeliveryOptionId",
                principalTable: "DeliveryOption",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_DeliveryOption_DeliveryOptionId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "DeliveryOption");

            migrationBuilder.DropTable(
                name: "EmailTemplates");

            migrationBuilder.DropIndex(
                name: "IX_Orders_DeliveryOptionId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DeliveryOptionId",
                table: "Orders");
        }
    }
}
