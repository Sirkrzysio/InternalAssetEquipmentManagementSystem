using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixSoftDeleteWithCorrectColumnNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_Email",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_Username",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_equipment_SerialNumber",
                table: "equipment");

            migrationBuilder.DropIndex(
                name: "IX_categories_Name",
                table: "categories");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true,
                filter: "\"DeletedAt\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_users_Username",
                table: "users",
                column: "Username",
                unique: true,
                filter: "\"DeletedAt\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_equipment_SerialNumber",
                table: "equipment",
                column: "SerialNumber",
                unique: true,
                filter: "\"DeletedAt\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_categories_Name",
                table: "categories",
                column: "Name",
                unique: true,
                filter: "\"DeletedAt\" IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_users_Email",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_users_Username",
                table: "users");

            migrationBuilder.DropIndex(
                name: "IX_equipment_SerialNumber",
                table: "equipment");

            migrationBuilder.DropIndex(
                name: "IX_categories_Name",
                table: "categories");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_users_Username",
                table: "users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_equipment_SerialNumber",
                table: "equipment",
                column: "SerialNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_categories_Name",
                table: "categories",
                column: "Name",
                unique: true);
        }
    }
}
