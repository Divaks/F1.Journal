using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace F1Journal.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamToSeasonRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TeamResponseDto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Base = table.Column<string>(type: "text", nullable: false),
                    TeamPrincipal = table.Column<string>(type: "text", nullable: false),
                    SeasonId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamResponseDto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamResponseDto_Seasons_SeasonId",
                        column: x => x.SeasonId,
                        principalTable: "Seasons",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DriverResponseDto",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Nationality = table.Column<string>(type: "text", nullable: false),
                    DriverNumber = table.Column<int>(type: "integer", nullable: false),
                    TeamResponseDtoId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DriverResponseDto", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DriverResponseDto_TeamResponseDto_TeamResponseDtoId",
                        column: x => x.TeamResponseDtoId,
                        principalTable: "TeamResponseDto",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_DriverResponseDto_TeamResponseDtoId",
                table: "DriverResponseDto",
                column: "TeamResponseDtoId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamResponseDto_SeasonId",
                table: "TeamResponseDto",
                column: "SeasonId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DriverResponseDto");

            migrationBuilder.DropTable(
                name: "TeamResponseDto");
        }
    }
}
