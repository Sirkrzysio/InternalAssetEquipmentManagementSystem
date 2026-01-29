using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.Assignments;

public class CreateAssignmentDto
{
    public Guid AssetId { get; set; }
    public Guid UserId { get; set; }
    public AssignmentType Type { get; set; } = AssignmentType.Permanent;
    public DateTime? ExpectedReturnDate { get; set; }
    public string? Notes { get; set; }
}
