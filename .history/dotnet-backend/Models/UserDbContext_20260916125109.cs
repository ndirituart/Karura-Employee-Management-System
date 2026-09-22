using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace dotnet_backend.Models
{
    // 1. Main DbContext class (un-nested)
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }

    // 2. User entity model
    [Table("Users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int userId { get; set; }
        public string emailId { get; set; } = string.Empty;
        public string fullName { get; set; } = string.Empty;
        public string mobileNo { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string role { get; set; } = string.Empty;
        public string createdDate { get; set; } = DateTime.UtcNow.ToString("o");
    }

    // 3. Login DTO model
    public class UserLogin
    {
        public string emailId { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
    }
}

//ISSUE ALL ALONG: 