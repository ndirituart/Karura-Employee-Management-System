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

    

//ISSUE ALL ALONG: The core issue causing CS0542 is that you nested the public class UserDbContext : DbContext 
// inside an outer public class UserDbContext. Additionally, your UserController is missing a constructor
//  to inject UserDbContext and contains syntax bugs (like var.userExistWithEmail and incorrect logic check
//  for new user registration).

//ISSUE ALL ALONG: The error CS0101 means duplicate class definitions. Before we put User and UserLogin inside Models/UserDbContext.cs. However, you also have standalone Models/User.cs and Models/UserLogin.cs files in your project directory. Because both files define the same class in dotnet_backend.Models, C# is throwing a build conflict.