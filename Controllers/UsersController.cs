using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WeatherAppWithGeolocation.Models;
namespace WeatherAppWithGeolocation.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UsersController(DatabaseContext context)
        {
            _context = context;
        }

        // [HttpGet]
        // [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        // public async Task<ActionResult<string>> GetUserPhotoURL()
        // {
        //     // Find the location in the database using `FindAsync` to look it up by id
        //     User currentUser = await _context.Users.FindAsync(GetCurrentUserId());


        //     // If we didn't find anything, we receive a `null` in return
        //     if (currentUser == null)
        //     {
        //         // Return a `404` response to the client indicating we could not find a location with this id
        //         return NotFound();
        //     }

        //     //  Return the location as a JSON object.
        //     return currentUser.PhotoURL;
        // }


        // POST: api/Users
        //
        // Creates a new user in the database.
        //
        // The `body` of the request is parsed and then made available to us as a User
        // variable named user. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our User POCO class. This represents the
        // new values for the record.
        //
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Indicate to the database context we want to add this new record
            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Return a response that indicates the object was created (status code `201`) and some additional
                // headers with details of the newly created object.
                return CreatedAtAction("GetUser", new { id = user.Id }, user);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException)
            {
                var response = new
                {
                    status = 400,
                    errors = new List<string>() { "This account already exists!" }
                };
                return BadRequest(response);
            }
        }

        // // Private helper method that looks up an existing user by the supplied id
        // private bool UserExists(int id)
        // {
        //     return _context.Users.Any(user => user.Id == id);
        // }

        private int GetCurrentUserId()
        {
            // Get the User Id from the claim and then parse it as an integer.
            return int.Parse(User.Claims.FirstOrDefault(claim => claim.Type == "Id").Value);
        }
    }
}
