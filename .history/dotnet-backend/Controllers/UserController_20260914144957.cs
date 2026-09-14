using Microsoft.AspNetCore.Mvc;

namespace KaruraEmployeesMIS.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    //1. API endpoint to create a new user. The endpoint accepts a POST request
    //  with the user details in the request body and returns a 201 Created response with the location of the newly created user.
	[HttpPost ("CreateNewUser")]
	public IActionResult CreateUser(User obj)
    {
        //loop to check if user already exists in the database based on emailId and mobileNo
        var.userExistWithEmail = _context.Users.FirstOrDefault(u => u.emailId == obj.emailId);

        if (userExistWithEmail != null)
        {
            _context.Users.Add(obj)
            return BadRequest("User with the same email already exists.");
        }

        _context.Users.Add(obj); //create
        _context.SaveChanges(); //saves
        return CreatedAtAction(nameof(GetUser), new { id = obj.userId }, "User " + obj.fullName + " created successfully"); //success message
    }

    [HttpGet]
	public IActionResult GetUsers()
	{
		return Ok(Array.Empty<object>());
	}

	[HttpGet("{id:int}")]
	public IActionResult GetUser(int id)
	{
		return NotFound();
	}

	

	[HttpPut("{id:int}")]
	public IActionResult UpdateUser(int id, [FromBody] object user)
	{
		return NoContent();
	}

	[HttpDelete("{id:int}")]
	public IActionResult DeleteUser(int id)
	{
		return NoContent();
	}
}
