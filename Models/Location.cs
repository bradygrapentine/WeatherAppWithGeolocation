using System.ComponentModel.DataAnnotations;

namespace WeatherAppWithGeolocation.Models
{
    public class Location
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        // ---------------------------------- //

        [Required]
        public string Name { get; set; }

        [Required]
        public string Zipcode { get; set; }

        public string Longitude { get; set; }

        public string Latitude { get; set; }
    }
}