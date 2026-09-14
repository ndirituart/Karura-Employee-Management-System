using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
    public class UserDbContext
    {
         
        //1. Add a new class UserDbContext that inherits from DbContext to manage the database context for user management.
        public class UserDbContext : DbContext
        {
            public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
            {
            }

            public DbSet<User> Users { get; set; }
        }

       //2. DB Set for the User entity to represent the Users table in the database. The User class defines the properties of the User entity, including userId, emailId, fullName, mobileNo, password, role, and createdDate. The userId property is marked as the primary key and is set to auto-generate its value using the DatabaseGeneratedOption.Identity attribute.
        [Table("Users")]
        public DbSet<User> Users { get; set; }

        public class User
        {
            [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            // Primary key for the User entity and remaining details in the table
            public int userId { get; set; }
            public string emailId { get; set; }
            public string fullName { get; set; }
            public string mobileNo { get; set; }
            public string password { get; set; }
            public string role { get; set; } //new added role column to store user roles (Admin/User)
            public string createdDate { get; set; }
        }
    }
}