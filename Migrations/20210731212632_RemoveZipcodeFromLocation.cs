using Microsoft.EntityFrameworkCore.Migrations;

namespace WeatherAppWithGeolocation.Migrations
{
    public partial class RemoveZipcodeFromLocation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Zipcode",
                table: "Locations");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Zipcode",
                table: "Locations",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
