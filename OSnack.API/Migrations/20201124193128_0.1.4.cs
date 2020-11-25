using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _014 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Users_UserId",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_oEmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Addresses",
                newName: "UserId1");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_UserId",
                table: "Addresses",
                newName: "IX_Addresses_UserId1");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "Products",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Users_UserId1",
                table: "Addresses",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_oEmailTemplateId",
                table: "ServerVariablesForEmail",
                column: "oEmailTemplateId",
                principalTable: "EmailTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Addresses_Users_UserId1",
                table: "Addresses");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_oEmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.RenameColumn(
                name: "UserId1",
                table: "Addresses",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Addresses_UserId1",
                table: "Addresses",
                newName: "IX_Addresses_UserId");

            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Addresses_Users_UserId",
                table: "Addresses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CategoryId",
                table: "Products",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_oEmailTemplateId",
                table: "ServerVariablesForEmail",
                column: "oEmailTemplateId",
                principalTable: "EmailTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
