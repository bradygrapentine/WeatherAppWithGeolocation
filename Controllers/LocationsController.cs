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
    // All of these routes will be at the base URL:     /api/Locations
    // That is what "api/[controller]" means below. It uses the name of the controller
    // in this case LocationsController to determine the URL
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        // This is the variable you use to have access to your database
        private readonly DatabaseContext _context;

        // Constructor that recives a reference to your database context
        // and stores it in _context for you to use in your API methods
        public LocationsController(DatabaseContext context)
        {
            _context = context;
        }

        // GET: api/Locations/5
        //
        // Fetches and returns a specific location by finding it by id. The id is specified in the
        // URL. In the sample URL above it is the `5`.  The "{id}" in the [HttpGet("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<List<Location>>> GetLocations()
        {
            // Find the location in the database using `FindAsync` to look it up by id
            var location = await _context.Locations.Where(location => location.UserId == GetCurrentUserId())
                                                                     .OrderByDescending(row => row.Id)
                                                                             .ToListAsync();
            ;

            // If we didn't find anything, we receive a `null` in return
            if (location == null)
            {
                // Return a `404` response to the client indicating we could not find a location with this id
                return NotFound();
            }

            //  Return the location as a JSON object.
            return location;
        }

        // POST: api/Locations
        //
        // Creates a new location in the database.
        //
        // The `body` of the request is parsed and then made available to us as a Location
        // variable named location. The controller matches the keys of the JSON object the client
        // supplies to the names of the attributes of our Location POCO class. This represents the
        // new values for the record.
        //
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<Location>> PostLocation(Location location)
        {
            // Indicate to the database context we want to add this new record
            location.UserId = GetCurrentUserId();
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            // Return a response that indicates the object was created (status code `201`) and some additional
            // headers with details of the newly created object.
            return CreatedAtAction("GetLocation", new { id = location.Id }, location);
        }

        // DELETE: api/Locations/5
        //
        // Deletes an individual location with the requested id. The id is specified in the URL
        // In the sample URL above it is the `5`. The "{id} in the [HttpDelete("{id}")] is what tells dotnet
        // to grab the id from the URL. It is then made available to us as the `id` argument to the method.
        //
        [HttpDelete("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            // Find this location by looking for the specific id
            var location = await _context.Locations.FindAsync(id);
            if (GetCurrentUserId() != location.UserId)
            {
                return BadRequest();
            }
            if (location == null)
            {
                // There wasn't a location with that id so return a `404` not found
                return NotFound();
            }

            // Tell the database we want to remove this record
            _context.Locations.Remove(location);

            // Tell the database to perform the deletion
            await _context.SaveChangesAsync();

            // Return a copy of the deleted data
            return Ok(location);
        }

        // Private helper method that looks up an existing location by the supplied id
        private bool LocationExists(int id)
        {
            return _context.Locations.Any(location => location.Id == id);
        }


        private int GetCurrentUserId()
        {
            return int.Parse(User.Claims.FirstOrDefault(claim => claim.Type == "Id").Value);
        }
    }
}
