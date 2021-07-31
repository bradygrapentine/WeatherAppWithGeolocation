using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WeatherAppWithGeolocation.Models;
using WeatherAppWithGeolocation.Utils;

namespace WeatherAppWithGeolocation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessionsController : ControllerBase
    {
        private readonly DatabaseContext _context;
        readonly protected string JWT_KEY;
        // Constructor that receives a reference to your database context
        // and stores it in _context for you to use in your API methods
        public SessionsController(DatabaseContext context, IConfiguration config)
        {
            _context = context;
            JWT_KEY = config["JWT_KEY"];
        }
        public class LoginUser
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginUser loginUser)
        {
            var foundUser = await _context.Users.FirstOrDefaultAsync(user => user.Username == loginUser.Username);

            if (foundUser != null && foundUser.IsValidPassword(loginUser.Password))
            {
                var response = new
                {
                    // This is the login token
                    token = new TokenGenerator(JWT_KEY).TokenFor(foundUser),

                    // The is the user details
                    user = foundUser
                };

                return Ok(response);
            }
            else
            {
                var response = new
                {
                    status = 400,
                    errors = new List<string>() { "Invalid Email Address or Password" }
                };

                return BadRequest(response);
            }
        }
    }
}