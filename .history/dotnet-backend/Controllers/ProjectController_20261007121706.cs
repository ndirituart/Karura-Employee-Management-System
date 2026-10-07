using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using dotnet_backend.Models;

namespace dotnet_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ============================================================
        // 1. LIST  — GET /api/Project
        // ============================================================
        [HttpGet]
        public async Task<IActionResult> GetAllProjects()
        {
            var list = await _context.Projects
                .Where(p => !p.isDeleted)
                .OrderByDescending(p => p.createdDate)
                .ToListAsync();

            return Ok(list);
        }

        // ============================================================
        // 2. READ  — GET /api/Project/{id}
        // ============================================================
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetProject(int id)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.projectId == id && !p.isDeleted);

            if (project == null) return NotFound();
            return Ok(project);
        }

        // ============================================================
        // 3. CREATE  — POST /api/Project
        // ============================================================
        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] Project obj)
        {
            if (obj == null)
                return BadRequest(new { message = "Request body is required." });

            // If a lead employee is specified, verify they exist
            if (obj.leadByEmpId.HasValue)
            {
                var empExists = await _context.Employees
                    .AnyAsync(e => e.employeeId == obj.leadByEmpId.ToString() && !e.isDeleted);
                // If your Employees.employeeId is a string "EMP-001", the check above
                // needs the string form. If it's an int, use obj.leadByEmpId.Value directly.

                if (!empExists)
                    return BadRequest(new { message = $"No employee exists with ID {obj.leadByEmpId}." });
            }

            // Server-controlled fields
            obj.projectId = 0;                       // let the DB generate it
            obj.createdDate = DateTime.UtcNow;
            obj.updatedDate = null;
            obj.deletedDate = null;
            obj.isDeleted = false;
            if (string.IsNullOrWhiteSpace(obj.status))
                obj.status = "Active";

            _context.Projects.Add(obj);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = obj.projectId }, obj);
        }

        // ============================================================
        // 4. UPDATE  — PUT /api/Project/{id}
        // ============================================================
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] Project project)
        {
            var existing = await _context.Projects
                .FirstOrDefaultAsync(p => p.projectId == id && !p.isDeleted);

            if (existing == null) return NotFound();

            // Update only the user-editable fields
            existing.projectName    = project.projectName;
            existing.clientName     = project.clientName;
            existing.startDate      = project.startDate;
            existing.leadByEmpId    = project.leadByEmpId;
            existing.contactPerson  = project.contactPerson;
            existing.contactNoProject = project.contactNoProject;
            existing.status         = project.status;
            existing.budget         = project.budget;

            // Do NOT touch: projectId, createdDate, deletedDate, isDeleted

            await _context.SaveChangesAsync();   // stamps updatedDate

            return Ok(existing);
        }

        // ============================================================
        // 5. SOFT DELETE  — DELETE /api/Project/{id}
        // ============================================================
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.projectId == id && !p.isDeleted);

            if (project == null) return NotFound();

            project.isDeleted   = true;
            project.deletedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ============================================================
        // 6. OPTIONAL — restore a soft-deleted project
        //    POST /api/Project/{id}/restore
        // ============================================================
        [HttpPost("{id:int}/restore")]
        public async Task<IActionResult> RestoreProject(int id)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.projectId == id);

            if (project == null) return NotFound();
            if (!project.isDeleted) return BadRequest(new { message = "Project is not deleted." });

            project.isDeleted   = false;
            project.deletedDate = null;

            await _context.SaveChangesAsync();
            return Ok(project);
        }
    }
}