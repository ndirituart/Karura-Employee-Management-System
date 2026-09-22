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

    // // 3. Login DTO model
    // public class UserLogin
    // {
    //     public string emailId { get; set; } = string.Empty;
    //     public string password { get; set; } = string.Empty;
    // }
}

//ISSUE ALL ALONG: The core issue causing CS0542 is that you nested the public class UserDbContext : DbContext 
// inside an outer public class UserDbContext. Additionally, your UserController is missing a constructor
//  to inject UserDbContext and contains syntax bugs (like var.userExistWithEmail and incorrect logic check
//  for new user registration).