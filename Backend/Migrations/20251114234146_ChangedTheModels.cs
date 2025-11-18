using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace F1Journal.Migrations
{
    /// <inheritdoc />
    public partial class ChangedTheModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Seasons",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Races",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Seasons_UserId",
                table: "Seasons",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Races_UserId",
                table: "Races",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Races_Users_UserId",
                table: "Races",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Seasons_Users_UserId",
                table: "Seasons",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Races_Users_UserId",
                table: "Races");

            migrationBuilder.DropForeignKey(
                name: "FK_Seasons_Users_UserId",
                table: "Seasons");

            migrationBuilder.DropIndex(
                name: "IX_Seasons_UserId",
                table: "Seasons");

            migrationBuilder.DropIndex(
                name: "IX_Races_UserId",
                table: "Races");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Seasons");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Races");
        }
    }
}
