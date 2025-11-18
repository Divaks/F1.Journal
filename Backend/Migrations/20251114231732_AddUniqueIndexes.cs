using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace F1Journal.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Seasons_Year",
                table: "Seasons",
                column: "Year",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Races_Name_SeasonId",
                table: "Races",
                columns: new[] { "Name", "SeasonId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seasons_Year",
                table: "Seasons");

            migrationBuilder.DropIndex(
                name: "IX_Races_Name_SeasonId",
                table: "Races");
        }
    }
}
