using Microsoft.AspNetCore.Mvc;

namespace KaruraEmployeesMIS.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    //1. API endpoint to create a new user. The endpoint accepts a POST request
    //  with the user details in the request body and returns a 201 Created response with the location of the newly created user.
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
