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
        var employeeExistWithUserId = _context.Employees.FirstOrDefault(u => u.userId == obj.userId);

        // If employee does NOT exist, create the account
        if (employeeExistWithUserId == null)
        {
            return BadRequest("No such user exists.");
        }
        else
        {
            _context.Employees.Add(obj);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetEmployee), new { id = obj.employeeId }, obj);
        }
         
    }


    // 2. Get All Employees Endpoint
    [HttpGet("GetEmployees")]
    public IActionResult GetEmployees()
    {
        var list = _context.Employees.ToList();
        return Ok(list);
    }

    // 3. Get Employee by ID Endpoint
    [HttpGet("{id:int}")]
    public IActionResult GetEmployee(int id)
    {
        var employee = _context.Employees.FirstOrDefault(u => u.employeeId == id);
        if (employee == null)
        {
            return NotFound();
        }
        return Ok(employee);
    }

    // 4. Update Employee Endpoint
    [HttpPut("{id:int}")]
    public IActionResult UpdateEmployee(int id, [FromBody] Employee employee)
    {
        var existingEmployee = _context.Employees.FirstOrDefault(u => u.employeeId == id);
        if (existingEmployee == null)
        {
            return NotFound();
        }

        existingEmployee.firstName = employee.firstName;
        existingEmployee.lastName = employee.lastName;
        existingEmployee.emailId = employee.emailId;
        existingEmployee.mobileNo = employee.mobileNo;
        existingEmployee.role = employee.role;
        existingEmployee.department = employee.department;
        existingEmployee.jobTitle = employee.jobTitle;
        existingEmployee.monthlySalary = employee.monthlySalary;
        existingEmployee.status = employee.status;
        existingEmployee.county = employee.department;
        existingEmployee.department = employee.department;
        existingEmployee.department = employee.department;

        _context.SaveChanges();
        return Ok(existingEmployee);
    }

    // 6. Delete Employee Endpoint
    [HttpDelete("{id:int}")]
    public IActionResult DeleteEmployee(int id)
    {
        var employee = _context.Employees.FirstOrDefault(u => u.employeeId == id);
        if (employee == null)
        {
            return NotFound();
        }

        _context.Employees.Remove(employee);
        _context.SaveChanges();
        return NoContent();
    }
    
}