using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnet_backend.Models;

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