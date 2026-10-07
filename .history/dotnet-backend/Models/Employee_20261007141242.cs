using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnet_backend.Models;


    public class Employee
    {
        [Key]
        // [StringLength(10)]
        public string employeeId { get; set; } = string.Empty;   // Starts from "EMP-001"

        public int userId { get; set; }                          // Connect to Users using user-id

        // [Required, StringLength(80)]
        public string firstName { get; set; } = string.Empty;

        // [Required, StringLength(80)]
        public string lastName { get; set; } = string.Empty;

        // [Required, StringLength(150)]
        public string emailId { get; set; } = string.Empty;

        // [StringLength(20)]
        public string? mobileNo { get; set; }

        public string? role { get; set; }                        // set from User, not updatable

        // [StringLength(80)]
        public string? department { get; set; }

        // [StringLength(120)]
        public string? jobTitle { get; set; }

        // [Column(TypeName = "decimal(18,2)")]
        public decimal? monthlySalary { get; set; }

        // [StringLength(30)]
        public string? status { get; set; }

        [StringLength(60)]
        public string? county { get; set; }

        [StringLength(60)]
        public string? townCity { get; set; }

        [StringLength(120)]
        public string? postalAddress { get; set; }

        //automatic columns

        public DateTime createdDate { get; set; } = DateTime.UtcNow;

        public DateTime? updatedDate { get; set; }

        public DateTime? deletedDate { get; set; }

        // soft deleting column
        public bool isDeleted { get; set; } = false;
    }

