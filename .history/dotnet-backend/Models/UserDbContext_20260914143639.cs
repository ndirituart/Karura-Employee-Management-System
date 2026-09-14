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
            // Primary key for the User entity and remaining details in the table
            public int userId { get; set; }
            public string emailId { get; set; }
            public string fullName { get; set; }
            public string mobileNo { get; set; }
            public string password { get; set; }
            public string createdDate { get; set; }
        }
    }
}