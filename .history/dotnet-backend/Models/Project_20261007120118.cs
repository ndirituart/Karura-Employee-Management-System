using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnet_backend.Models
{
    public class Project
    {
        [Key]
        public int projectId { get; set; }                  // auto-increment PK

        [Required, StringLength(150)]
        public string projectName { get; set; } = string.Empty;

        [Required, StringLength(150)]
        public string clientName { get; set; } = string.Empty;

        [Column(TypeName = "date")]
        public DateTime startDate { get; set; }

        public int? leadByEmpId { get; set; }               // optional FK to Employee.employeeId

        [StringLength(150)]
        public string? contactPerson { get; set; }

        [StringLength(30)]
        public string? contactNoProject { get; set; }

        [StringLength(30)]
        public string status { get; set; } = "Active";      // Active / Completed / Suspended

        [Column(TypeName = "decimal(18,2)")]
        public decimal? budget { get; set; }                // optional

        // ---- Audit columns ----
        public DateTime createdDate { get; set; } = DateTime.UtcNow;
        public DateTime? updatedDate { get; set; }
        public DateTime? deletedDate { get; set; }
        public bool isDeleted { get; set; } = false;
    }
}