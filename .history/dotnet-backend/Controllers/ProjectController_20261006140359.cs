using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dotnet_backend.Models;

namespace dotnet_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("allowCors")]
public class ProjectController : ControllerBase
{
    private readonly ProjectDbContext _context;

    // Injected Dependency Injection constructor
    public ProjectController(ProjectDbContext context)
    {
        _context = context;
    }

    // 1. Create Project Endpoint
    [HttpPost("CreateNewProject")]
    public IActionResult CreateUser([FromBody] Project obj)
    {
        var projectExistWithEmail = _context.Projects.FirstOrDefault(u => u.emailId == obj.emailId);

        // If project does NOT exist, create the account
        if (projectExistWithEmail == null)
        {
            _context.Users.Add(obj);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetUser), new { id = obj.userId }, obj);
        }
        else
        {
            return BadRequest("User with the same email already exists.");
        }
    }

    // 2. Login Endpoint
    [HttpPost("Login")]
    public IActionResult Login([FromBody] UserLogin userLogin)
    {
        var user = _context.Users.FirstOrDefault(u => u.emailId == userLogin.emailId && u.password == userLogin.password);
        
        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(user);
    }

    // 3. Get All Users Endpoint
    [HttpGet("GetUsers")]
    public IActionResult GetUsers()
    {
        var list = _context.Users.ToList();
        return Ok(list);
    }

    // 4. Get User by ID Endpoint
    [HttpGet("{id:int}")]
    public IActionResult GetUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.userId == id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    // 5. Update User Endpoint
    [HttpPut("{id:int}")]
    public IActionResult UpdateUser(int id, [FromBody] User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.userId == id);
        if (existingUser == null)
        {
            return NotFound();
        }

        existingUser.fullName = user.fullName;
        existingUser.emailId = user.emailId;
        existingUser.mobileNo = user.mobileNo;
        existingUser.role = user.role;

        _context.SaveChanges();
        return Ok(existingUser);
    }

    // 6. Delete User Endpoint
    [HttpDelete("{id:int}")]
    public IActionResult DeleteUser(int id)
    {
        var user = _context.Users.FirstOrDefault(u => u.userId == id);
        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        _context.SaveChanges();
        return NoContent();
    }
    
}