﻿using AssetManagement.Application.DTOs.Common;

namespace AssetManagement.Application.Interfaces;

public interface IDataCleanupService
{
    Task<DataCleanupResult> PerformCleanupAsync(bool ignoreRetention = false);
    Task<DataRetentionStatus> GetRetentionStatusAsync();
}

public class DataCleanupResult
{
    public int CategoriesDeleted { get; set; }
    public int LocationsDeleted { get; set; }
    public int UsersDeleted { get; set; }
    public int AssetsDeleted { get; set; }
    public int AuditLogsDeleted { get; set; }
    public DateTime ExecutedAt { get; set; }
    public List<string> Warnings { get; set; } = new();
}

public class DataRetentionStatus
{
    public List<PendingDeletionItem> Categories { get; set; } = new();
    public List<PendingDeletionItem> Locations { get; set; } = new();
    public List<PendingDeletionItem> Users { get; set; } = new();
    public List<PendingDeletionItem> Assets { get; set; } = new();
    public List<PendingAuditLogDeletionItem> AuditLogs { get; set; } = new();
    public RetentionPolicies Policies { get; set; } = new();
}

public class PendingDeletionItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime DeletedAt { get; set; }
    public int HoursUntilPermanentDelete { get; set; }
    public bool IsUrgent { get; set; }
}

public class PendingAuditLogDeletionItem
{
    public Guid Id { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public int HoursUntilPermanentDelete { get; set; }
    public bool IsUrgent { get; set; }
}

public class RetentionPolicies
{
    public string Categories { get; set; } = "24 hours";
    public string Locations { get; set; } = "24 hours";
    public string Users { get; set; } = "30 days";
    public string Assets { get; set; } = "90 days";
    public string AuditLogs { get; set; } = "1 hour";
}
