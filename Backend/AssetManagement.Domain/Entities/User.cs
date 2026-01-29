﻿using AssetManagement.Domain.Entities.Common;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Domain.Entities;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;  // Dodane dla bazy danych
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? PhoneNumber { get; set; }
    public UserRole Role { get; set; } = UserRole.Employee;
    public bool IsActive { get; set; } = true;
    
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    
    public string FullName => $"{FirstName} {LastName}";
}
