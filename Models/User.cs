using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace WeatherAppWithGeolocation.Models
{
    public class User
    {
        public int Id { get; set; }

        // ---------------------------------- //

        [Required]
        public string Name { get; set; }

        [Required]
        public string Username { get; set; }


        public string PhotoURL { get; set; }

        [JsonIgnore]
        public string HashedPassword { get; set; }

        // ---------------------------------- //

        public string Password
        {
            set
            {
                this.HashedPassword = new PasswordHasher<User>().HashPassword(this, value);
            }
        }

        // ---------------------------------- //

        public bool IsValidPassword(string password)
        {
            var passwordVerification = new PasswordHasher<User>().VerifyHashedPassword(this, this.HashedPassword, password);
            return passwordVerification == PasswordVerificationResult.Success;
        }

        // ---------------------------------- //
    }
}