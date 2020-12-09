using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _019 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Massage",
                table: "AppLogs",
                newName: "Message");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "AppLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "AppLogs");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "AppLogs",
                newName: "Massage");
        }
    }
}
