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
        //Employee must have an existing UserId
        var employeeExistWithUserId = _context.Employeess.FirstOrDefault(u => u.userId == obj.userId);

        // If employee does NOT exist, create the account
        if (employeeExistWithUserId == null)
        {
            _context.Employeess.Add(obj);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetEmployee), new { id = obj.employeeId }, obj);
        }
        else
        {
            return BadRequest("Employee with the same  already exists.");
        }
    }

    // 2. Login Endpoint
    [HttpPost("Login")]
    public IActionResult Login([FromBody] EmployeeLogin employeeLogin)
    {
        var employee = _context.Employeess.FirstOrDefault(u => u.emailId == employeeLogin.emailId && u.password == employeeLogin.password);
        
        if (employee == null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(employee);
    }

    // 3. Get All Employees Endpoint
    [HttpGet("GetEmployees")]
    public IActionResult GetEmployees()
    {
        var list = _context.Employeess.ToList();
        return Ok(list);
    }

    // 4. Get Employee by ID Endpoint
    [HttpGet("{id:int}")]
    public IActionResult GetEmployee(int id)
    {
        var employee = _context.Employeess.FirstOrDefault(u => u.employeeId == id);
        if (employee == null)
        {
            return NotFound();
        }
        return Ok(employee);
    }

    // 5. Update Employee Endpoint
    [HttpPut("{id:int}")]
    public IActionResult UpdateEmployee(int id, [FromBody] Employee employee)
    {
        var existingEmployee = _context.Employeess.FirstOrDefault(u => u.employeeId == id);
        if (existingEmployee == null)
        {
            return NotFound();
        }

        existingEmployee.fullName = employee.fullName;
        existingEmployee.emailId = employee.emailId;
        existingEmployee.mobileNo = employee.mobileNo;
        existingEmployee.role = employee.role;

        _context.SaveChanges();
        return Ok(existingEmployee);
    }

    // 6. Delete Employee Endpoint
    [HttpDelete("{id:int}")]
    public IActionResult DeleteEmployee(int id)
    {
        var employee = _context.Employeess.FirstOrDefault(u => u.employeeId == id);
        if (employee == null)
        {
            return NotFound();
        }

        _context.Employeess.Remove(employee);
        _context.SaveChanges();
        return NoContent();
    }
    
}