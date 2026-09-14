using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_backend.Models
{
    public class UserDbContext
    {
        public class User
        {
            [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            
            public int userId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            
            public string Username { get; set; }
            public string Password { get; set; }
            public string Role { get; set; }
        }
    }
}