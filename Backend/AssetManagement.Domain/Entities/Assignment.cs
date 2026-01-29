﻿using AssetManagement.Domain.Entities.Common;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Domain.Entities;

public class Assignment : BaseEntity
{
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = null!;
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid? LocationId { get; set; }
    public Location? Location { get; set; }
    
    public AssignmentType Type { get; set; } = AssignmentType.Permanent;
    public DateTime AssignedAt { get; set; }
    public DateTime? ReturnedAt { get; set; }
    public DateTime? ExpectedReturnDate { get; set; }
    public string? Notes { get; set; }
    
    public bool IsActive => ReturnedAt == null;
}
