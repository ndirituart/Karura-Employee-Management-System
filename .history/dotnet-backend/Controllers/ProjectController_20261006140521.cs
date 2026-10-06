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
            _context.Projects.Add(obj);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProject), new { id = obj.projectId }, obj);
        }
        else
        {
            return BadRequest("Project with the same email already exists.");
        }
    }

    // 2. Login Endpoint
    [HttpPost("Login")]
    public IActionResult Login([FromBody] ProjectLogin projectLogin)
    {
        var project = _context.Projects.FirstOrDefault(u => u.emailId == projectLogin.emailId && u.password == projectLogin.password);
        
        if (project == null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(project);
    }

    // 3. Get All Projects Endpoint
    [HttpGet("GetProjects")]
    public IActionResult GetProjects()
    {
        var list = _context.Projects.ToList();
        return Ok(list);
    }

    // 4. Get Project by ID Endpoint
    [HttpGet("{id:int}")]
    public IActionResult GetProject(int id)
    {
        var project = _context.Projects.FirstOrDefault(u => u.projectId == id);
        if (project == null)
        {
            return NotFound();
        }
        return Ok(project);
    }

    // 5. Update Project Endpoint
    [HttpPut("{id:int}")]
    public IActionResult UpdateProject(int id, [FromBody] Project project)
    {
        var existingProject = _context.Projects.FirstOrDefault(u => u.projectId == id);
        if (existingProject == null)
        {
            return NotFound();
        }

        existingProject.fullName = roject.fullName;
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