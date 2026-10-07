using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using dotnet_backend.Models;

namespace dotnet_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("allowCors")]
public class EmployeeController : ControllerBase
{
    private readonly EmployeeDbContext _context;

    // Injected Dependency Injection constructor
    public EmployeeController(EmployeeDbContext context)
    {
        _context = context;
    }

    // 1. Create Employee Endpoint
    [HttpPost("CreateNewEmployee")]
    public IActionResult CreateEmployee([FromBody] Employee obj)
    {
        var userExistWithEmail = _context.Employees.FirstOrDefault(u => u.emailId == obj.emailId);

        // If user does NOT exist, create the account
        if (userExistWithEmail == null)
        {
            _context.Employees.Add(obj);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetEmployee), new { id = obj.userId }, obj);
        }
        else
        {
            return BadRequest("Employee with the same email already exists.");
        }
    }

    // 2. Login Endpoint
    [HttpPost("Login")]
    public IActionResult Login([FromBody] EmployeeLogin userLogin)
    {
        var user = _context.Employees.FirstOrDefault(u => u.emailId == userLogin.emailId && u.password == userLogin.password);
        
        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(user);
    }

    // 3. Get All Employees Endpoint
    [HttpGet("GetEmployees")]
    public IActionResult GetEmployees()
    {
        var list = _context.Employees.ToList();
        return Ok(list);
    }

    // 4. Get Employee by ID Endpoint
    [HttpGet("{id:int}")]
    public IActionResult GetEmployee(int id)
    {
        var user = _context.Employees.FirstOrDefault(u => u.userId == id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    // 5. Update Employee Endpoint
    [HttpPut("{id:int}")]
    public IActionResult UpdateEmployee(int id, [FromBody] Employee user)
    {
        var existingEmployee = _context.Employees.FirstOrDefault(u => u.userId == id);
        if (existingEmployee == null)
        {
            return NotFound();
        }

        existingEmployee.fullName = user.fullName;
        existingEmployee.emailId = user.emailId;
        existingEmployee.mobileNo = user.mobileNo;
        existingEmployee.role = user.role;

        _context.SaveChanges();
        return Ok(existingEmployee);
    }

    // 6. Delete Employee Endpoint
    [HttpDelete("{id:int}")]
    public IActionResult DeleteEmployee(int id)
    {
        var user = _context.Employees.FirstOrDefault(u => u.userId == id);
        if (user == null)
        {
            return NotFound();
        }

        _context.Employees.Remove(user);
        _context.SaveChanges();
        return NoContent();
    }
    
}