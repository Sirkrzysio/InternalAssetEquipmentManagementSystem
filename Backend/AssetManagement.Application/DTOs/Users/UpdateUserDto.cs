using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.Users;

public class UpdateUserDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Department { get; set; }
    public UserRole Role { get; set; } = UserRole.Employee;
}
