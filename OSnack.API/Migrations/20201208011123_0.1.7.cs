using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _017 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_oEmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.RenameColumn(
                name: "oEmailTemplateId",
                table: "ServerVariablesForEmail",
                newName: "EmailTemplateId2");

            migrationBuilder.RenameIndex(
                name: "IX_ServerVariablesForEmail_oEmailTemplateId",
                table: "ServerVariablesForEmail",
                newName: "IX_ServerVariablesForEmail_EmailTemplateId2");

            migrationBuilder.AddColumn<int>(
                name: "EmailTemplateId",
                table: "ServerVariablesForEmail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServerVariablesForEmail_EmailTemplateId",
                table: "ServerVariablesForEmail",
                column: "EmailTemplateId");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.DropForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_EmailTemplateId2",
                table: "ServerVariablesForEmail");

            migrationBuilder.DropIndex(
                name: "IX_ServerVariablesForEmail_EmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.DropColumn(
                name: "EmailTemplateId",
                table: "ServerVariablesForEmail");

            migrationBuilder.RenameColumn(
                name: "EmailTemplateId2",
                table: "ServerVariablesForEmail",
                newName: "oEmailTemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_ServerVariablesForEmail_EmailTemplateId2",
                table: "ServerVariablesForEmail",
                newName: "IX_ServerVariablesForEmail_oEmailTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServerVariablesForEmail_EmailTemplates_oEmailTemplateId",
                table: "ServerVariablesForEmail",
                column: "oEmailTemplateId",
                principalTable: "EmailTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
