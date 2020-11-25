using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace OSnack.API.Migrations
{
    public partial class _004 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_oRegistrationMethod_Users_UserId",
                table: "oRegistrationMethod");

            migrationBuilder.DropPrimaryKey(
                name: "PK_oRegistrationMethod",
                table: "oRegistrationMethod");

            migrationBuilder.DropColumn(
                name: "RegisteredDate",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "oRegistrationMethod",
                newName: "RegistrationMethod");

            migrationBuilder.RenameIndex(
                name: "IX_oRegistrationMethod_UserId",
                table: "RegistrationMethod",
                newName: "IX_RegistrationMethod_UserId");

            migrationBuilder.AlterColumn<string>(
                name: "ExternalLinkedId",
                table: "RegistrationMethod",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RegistrationMethod",
                table: "RegistrationMethod",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RegistrationMethod_Users_UserId",
                table: "RegistrationMethod",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RegistrationMethod_Users_UserId",
                table: "RegistrationMethod");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RegistrationMethod",
                table: "RegistrationMethod");

            migrationBuilder.RenameTable(
                name: "RegistrationMethod",
                newName: "oRegistrationMethod");

            migrationBuilder.RenameIndex(
                name: "IX_RegistrationMethod_UserId",
                table: "oRegistrationMethod",
                newName: "IX_oRegistrationMethod_UserId");

            migrationBuilder.AddColumn<DateTime>(
                name: "RegisteredDate",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<string>(
                name: "ExternalLinkedId",
                table: "oRegistrationMethod",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_oRegistrationMethod",
                table: "oRegistrationMethod",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_oRegistrationMethod_Users_UserId",
                table: "oRegistrationMethod",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
