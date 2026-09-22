namespace dotnet_backend.Models;
// 2. User entity model
    // [Table("Users")]
public class User
{
    public int UserId { get; set; }
    public string EmailId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string MobileNo { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public string Role { get; set; } = string.Empty;
}