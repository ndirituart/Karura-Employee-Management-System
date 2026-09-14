using Microsoft.AspNetCore.Mvc;

namespace KaruraEmployeesMIS.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
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

	[HttpPost]
	public IActionResult CreateUser([FromBody] object user)
	{
		return CreatedAtAction(nameof(GetUser), new { id = 0 }, user);
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
