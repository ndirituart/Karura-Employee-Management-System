using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnet_backend.Models;

namespace dotnet_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeeController(AppDbContext context)
        {
            _context = context;
        }

       //1. To create an employee, changed employee-d to have a generic format ie EMP-001, EMP-002
        [HttpPost("CreateNewEmployee")]
        public async Task<IActionResult> CreateEmployee([FromBody] Employee obj)
        {
            // Employee must link to an existing User
            var user = await _context.Users.FirstOrDefaultAsync(u => u.userId == obj.userId);
            if (user == null)
            {
                return BadRequest(new { message = $"No user exists with ID {obj.userId}." });
            }

            // Prevent duplicate link: one employee per user
            var alreadyLinked = await _context.Employees
                .AnyAsync(e => e.userId == obj.userId && !e.isDeleted);
            if (alreadyLinked)
            {
                return Conflict(new { message = $"User {obj.userId} is already linked to an employee." });
            }

            // Generate the next ID: EMP-001, EMP-002, ...
            obj.employeeId = await GenerateNextEmployeeIdAsync();
            obj.createdDate = DateTime.UtcNow;
            obj.updatedDate = null;
            obj.deletedDate = null;
            obj.isDeleted = false;

            // Role comes from the User, not the request body
            obj.role = user.role;

            _context.Employees.Add(obj);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = obj.employeeId }, obj);
        }

       // Ensures the employee IDs are incremental
        private async Task<string> GenerateNextEmployeeIdAsync()
        {
            // Pull all IDs that match EMP-### (including soft-deleted, so numbers don't get reused)
            var existingIds = await _context.Employees
                .Where(e => e.employeeId.StartsWith("EMP-"))
                .Select(e => e.employeeId)
                .ToListAsync();

            int max = 0;
            foreach (var id in existingIds)
            {
                if (id.Length >= 7 && int.TryParse(id.Substring(4), out var n) && n > max)
                    max = n;
            }

            return $"EMP-{(max + 1):D3}";   
        }

        //2(a). To fetch all Employees 
        [HttpGet]
        public async Task<IActionResult> GetAllEmployees()
        {
            var list = await _context.Employees
                .Where(e => !e.isDeleted)
                .OrderBy(e => e.employeeId)
                .ToListAsync();
            return Ok(list);
        }

        //2(b). To get an Employee by their employee-id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(string id)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.employeeId == id && !e.isDeleted);

            if (employee == null) return NotFound();
            return Ok(employee);
        }

       //3. To update an employee's details, some details, role is unchangeable because logically a ranger can't be a biologist
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(string id, [FromBody] Employee employee)
        {
            var existing = await _context.Employees
                .FirstOrDefaultAsync(e => e.employeeId == id && !e.isDeleted);

            if (existing == null) return NotFound();

            // Role cannot be changed
            existing.firstName    = employee.firstName;
            existing.lastName     = employee.lastName;
            existing.emailId      = employee.emailId;
            existing.mobileNo     = employee.mobileNo;
            existing.department   = employee.department;
            existing.jobTitle     = employee.jobTitle;
            existing.monthlySalary = employee.monthlySalary;
            existing.status       = employee.status;
            existing.county       = employee.county;
            existing.townCity     = employee.townCity;
            existing.postalAddress = employee.postalAddress;

            // Do NOT touch employeeId, userId, role, createdDate, deletedDate, isDeleted

            await _context.SaveChangesAsync();   // stamps updatedDate

            return Ok(existing);
        }

        // ============================================================
        // 4. DELETE  — soft delete, sets deletedDate
        //    DELETE /api/Employee/{id}
        // ============================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.employeeId == id && !e.isDeleted);

            if (employee == null) return NotFound();

            employee.isDeleted   = true;
            employee.deletedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}