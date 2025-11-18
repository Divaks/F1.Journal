using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace F1Journal.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexesForEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TeamPerformanceReviews_UserId",
                table: "TeamPerformanceReviews");

            migrationBuilder.DropIndex(
                name: "IX_RaceReviews_RaceId",
                table: "RaceReviews");

            migrationBuilder.DropIndex(
                name: "IX_RaceResults_DriverId",
                table: "RaceResults");

            migrationBuilder.DropIndex(
                name: "IX_DriverPerformanceReviews_UserId",
                table: "DriverPerformanceReviews");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Teams_Name",
                table: "Teams",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamPerformanceReviews_UserId_TeamId_RaceId",
                table: "TeamPerformanceReviews",
                columns: new[] { "UserId", "TeamId", "RaceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RaceReviews_RaceId_UserId",
                table: "RaceReviews",
                columns: new[] { "RaceId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_RaceResults_DriverId_RaceId",
                table: "RaceResults",
                columns: new[] { "DriverId", "RaceId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Drivers_DriverNumber",
                table: "Drivers",
                column: "DriverNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DriverPerformanceReviews_UserId_DriverId_RaceId",
                table: "DriverPerformanceReviews",
                columns: new[] { "UserId", "DriverId", "RaceId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Teams_Name",
                table: "Teams");

            migrationBuilder.DropIndex(
                name: "IX_TeamPerformanceReviews_UserId_TeamId_RaceId",
                table: "TeamPerformanceReviews");

            migrationBuilder.DropIndex(
                name: "IX_RaceReviews_RaceId_UserId",
                table: "RaceReviews");

            migrationBuilder.DropIndex(
                name: "IX_RaceResults_DriverId_RaceId",
                table: "RaceResults");

            migrationBuilder.DropIndex(
                name: "IX_Drivers_DriverNumber",
                table: "Drivers");

            migrationBuilder.DropIndex(
                name: "IX_DriverPerformanceReviews_UserId_DriverId_RaceId",
                table: "DriverPerformanceReviews");

            migrationBuilder.CreateIndex(
                name: "IX_TeamPerformanceReviews_UserId",
                table: "TeamPerformanceReviews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RaceReviews_RaceId",
                table: "RaceReviews",
                column: "RaceId");

            migrationBuilder.CreateIndex(
                name: "IX_RaceResults_DriverId",
                table: "RaceResults",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_DriverPerformanceReviews_UserId",
                table: "DriverPerformanceReviews",
                column: "UserId");
        }
    }
}
