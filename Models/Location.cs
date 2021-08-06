using System.ComponentModel.DataAnnotations;

namespace WeatherAppWithGeolocation.Models
{
    public class Location
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        // ---------------------------------- //

        [Required]
        public string CityName { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}

