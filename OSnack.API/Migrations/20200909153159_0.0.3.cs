using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _003 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_OrderItems_OrderItemId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Score_OrderItems_OrderItemId",
                table: "Score");

            migrationBuilder.DropIndex(
                name: "IX_Score_OrderItemId",
                table: "Score");

            migrationBuilder.DropIndex(
                name: "IX_Comments_OrderItemId",
                table: "Comments");

            migrationBuilder.AlterColumn<int>(
                name: "OrderItemId",
                table: "Score",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OrderItemId",
                table: "Comments",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Score_OrderItemId",
                table: "Score",
                column: "OrderItemId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Comments_OrderItemId",
                table: "Comments",
                column: "OrderItemId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_OrderItems_OrderItemId",
                table: "Comments",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Score_OrderItems_OrderItemId",
                table: "Score",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_OrderItems_OrderItemId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Score_OrderItems_OrderItemId",
                table: "Score");

            migrationBuilder.DropIndex(
                name: "IX_Score_OrderItemId",
                table: "Score");

            migrationBuilder.DropIndex(
                name: "IX_Comments_OrderItemId",
                table: "Comments");

            migrationBuilder.AlterColumn<int>(
                name: "OrderItemId",
                table: "Score",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "OrderItemId",
                table: "Comments",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.CreateIndex(
                name: "IX_Score_OrderItemId",
                table: "Score",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_OrderItemId",
                table: "Comments",
                column: "OrderItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_OrderItems_OrderItemId",
                table: "Comments",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Score_OrderItems_OrderItemId",
                table: "Score",
                column: "OrderItemId",
                principalTable: "OrderItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
