using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _013 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppLogs_Users_UserId",
                table: "AppLogs");

            migrationBuilder.DropIndex(
                name: "IX_AppLogs_UserId",
                table: "AppLogs");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "EmailTemplates");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Tokens",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AppLogs_UserId",
                table: "AppLogs",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_AppLogs_Users_UserId",
                table: "AppLogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppLogs_Users_UserId",
                table: "AppLogs");

            migrationBuilder.DropIndex(
                name: "IX_AppLogs_UserId",
                table: "AppLogs");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tokens");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "EmailTemplates",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_AppLogs_UserId",
                table: "AppLogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppLogs_Users_UserId",
                table: "AppLogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
