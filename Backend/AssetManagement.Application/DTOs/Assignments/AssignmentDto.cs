using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.Assignments;

public class AssignmentDto
{
    public Guid Id { get; set; }
    public Guid AssetId { get; set; }
    public string AssetName { get; set; } = string.Empty;
    public string AssetSerialNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public AssignmentType Type { get; set; }
    public string TypeName => Type.ToString();
    public DateTime AssignedAt { get; set; }
    public DateTime? ReturnedAt { get; set; }
    public DateTime? ExpectedReturnDate { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
