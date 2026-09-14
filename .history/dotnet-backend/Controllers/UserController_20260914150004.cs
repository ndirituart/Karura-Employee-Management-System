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
            _context.Users.Add(obj); //create
            _context.SaveChanges(); //saves
            return CreatedAtAction(nameof(GetUser), new { id = obj.userId }, "User " + obj.fullName + " created successfully"); //success message
        }
        else{
             return BadRequest("User with the same email already exists.");
        }

    }

    //2. API endpoint to login a user. The endpoint accepts a POST request with the user credentials in the request body and returns a 200 OK response with a JWT token in the response body if the credentials are valid, or a 401 Unauthorized response if the credentials are invalid.
    [HttpPost("Login")]
    public IActionResult Login([FromBody] UserLogin userLogin)
    {
        var user = _context.Users.FirstOrDefault(u => u.emailId == userLogin.emailId && u.password == userLogin.password);
        if (user == null)
        {
            return StatusCode(401, "Invalid email or password")
        }
        else{
            return StatusCode(200, "Successful Login!",user)
        }
    }
    // 3.  API endpoint to retrieve all users. The endpoint accepts a GET request and returns a 200 OK response with the list of users in the response body.

    [HttpGet= ("GetUsers")]
	public IActionResult GetUsers()
	{
        var list = _context.Users.ToList()
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
