using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _012 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValueType",
                table: "Tokens");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Tokens",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "EmailTemplates",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TokenUrlPath",
                table: "EmailTemplates",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ServerVariablesForEmail",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnumValue = table.Column<int>(nullable: false),
                    ReplacementValue = table.Column<string>(nullable: false),
                    oEmailTemplateId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServerVariablesForEmail", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServerVariablesForEmail_EmailTemplates_oEmailTemplateId",
                        column: x => x.oEmailTemplateId,
                        principalTable: "EmailTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ServerVariablesForEmail_oEmailTemplateId",
                table: "ServerVariablesForEmail",
                column: "oEmailTemplateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServerVariablesForEmail");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Tokens");

            migrationBuilder.DropColumn(
                name: "Subject",
                table: "EmailTemplates");

            migrationBuilder.DropColumn(
                name: "TokenUrlPath",
                table: "EmailTemplates");

            migrationBuilder.AddColumn<int>(
                name: "ValueType",
                table: "Tokens",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
