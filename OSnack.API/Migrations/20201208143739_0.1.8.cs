using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _018 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId2",
                table: "ServerVariablesForEmail");

            migrationBuilder.DropIndex(
                name: "IX_ServerVariablesForEmail_EmailTemplateId2",
                table: "ServerVariablesForEmail");

            migrationBuilder.DropColumn(
                name: "EmailTemplateId2",
                table: "ServerVariablesForEmail");

            migrationBuilder.AddColumn<bool>(
                name: "IsPremitive",
                table: "DeliveryOption",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId",
                table: "ServerVariablesForEmail",
                column: "EmailTemplateId",
                principalTable: "EmailTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.DropColumn(
                name: "IsPremitive",
                table: "DeliveryOption");

            migrationBuilder.AddColumn<int>(
                name: "EmailTemplateId2",
                table: "ServerVariablesForEmail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServerVariablesForEmail_EmailTemplateId2",
                table: "ServerVariablesForEmail",
                column: "EmailTemplateId2");

            migrationBuilder.AddForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId",
                table: "ServerVariablesForEmail",
                column: "EmailTemplateId",
                principalTable: "EmailTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId2",
                table: "ServerVariablesForEmail",
                column: "EmailTemplateId2",
                principalTable: "EmailTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
