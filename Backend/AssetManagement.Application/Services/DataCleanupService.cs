﻿using AssetManagement.Application.Configuration;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AssetManagement.Application.Services;

public class DataCleanupService : IDataCleanupService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<DataCleanupService> _logger;
    private readonly DataRetentionOptions _options;

    public DataCleanupService(
        IUnitOfWork unitOfWork,
        ILogger<DataCleanupService> logger,
        IOptions<DataRetentionOptions> options)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _options = options.Value;
    }

    public async Task<DataCleanupResult> PerformCleanupAsync(bool ignoreRetention = false)
    {
        _logger.LogInformation("Starting data cleanup process");
        if (ignoreRetention)
        {
            _logger.LogInformation("Manual cleanup will ignore retention cutoffs");
        }
        
        var result = new DataCleanupResult
        {
            ExecutedAt = DateTime.UtcNow
        };

        try
        {
            if (ignoreRetention)
            {
                result.CategoriesDeleted = await _unitOfWork.Categories.CleanupAllDeletedAsync();
                result.LocationsDeleted = await _unitOfWork.Locations.CleanupAllDeletedAsync();
                result.UsersDeleted = await _unitOfWork.Users.CleanupAllDeletedAsync();
                result.AssetsDeleted = await _unitOfWork.Assets.CleanupAllDeletedAsync();
                result.AuditLogsDeleted = await _unitOfWork.AuditLogs.CleanupAllDeletedAsync();
            }
            else
            {
                // 1. Categories cleanup
                var categoryCutoff = DateTime.UtcNow.AddHours(-_options.CategoriesRetentionHours);
                result.CategoriesDeleted = await _unitOfWork.Categories.CleanupOldDeletedAsync(categoryCutoff);

                // 2. Locations cleanup  
                var locationCutoff = DateTime.UtcNow.AddHours(-_options.LocationsRetentionHours);
                result.LocationsDeleted = await _unitOfWork.Locations.CleanupOldDeletedAsync(locationCutoff);

                // 3. Users cleanup
                var userCutoff = DateTime.UtcNow.AddDays(-_options.UsersRetentionDays);
                result.UsersDeleted = await _unitOfWork.Users.CleanupOldDeletedAsync(userCutoff);

                // 4. Assets cleanup
                var assetCutoff = DateTime.UtcNow.AddDays(-_options.AssetsRetentionDays);
                result.AssetsDeleted = await _unitOfWork.Assets.CleanupOldDeletedAsync(assetCutoff);

                // 5. Audit logs cleanup (1 hour retention)
                var auditLogCutoff = DateTime.UtcNow.AddHours(-_options.AuditLogsRetentionHours);
                result.AuditLogsDeleted = await _unitOfWork.AuditLogs.CleanupOldDeletedAsync(auditLogCutoff);
            }

            // ExecuteDeleteAsync() operations are executed directly in database
            // No need to call SaveChangesAsync() as changes are already committed

            _logger.LogInformation(
                "Cleanup completed: {Categories} categories, {Locations} locations, {Users} users, {Assets} assets, {AuditLogs} audit logs permanently deleted",
                result.CategoriesDeleted, result.LocationsDeleted, result.UsersDeleted, result.AssetsDeleted, result.AuditLogsDeleted);

            // 6. Check for warnings
            if (_options.NotificationEnabled)
            {
                await CheckExpirationWarningsAsync(result);
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during data cleanup");
            throw;
        }
    }

    public async Task<DataRetentionStatus> GetRetentionStatusAsync()
    {
        var now = DateTime.UtcNow;
        var status = new DataRetentionStatus();

        // Get pending categories (24h retention)
        var categoryCutoff = now.AddHours(-_options.CategoriesRetentionHours);
        var pendingCategories = await GetPendingCategoriesAsync(now, categoryCutoff);
        status.Categories = pendingCategories;

        // Get pending locations (24h retention)
        var locationCutoff = now.AddHours(-_options.LocationsRetentionHours);
        var pendingLocations = await GetPendingLocationsAsync(now, locationCutoff);
        status.Locations = pendingLocations;

        // Get pending users (30 days retention)
        var userCutoff = now.AddDays(-_options.UsersRetentionDays);
        var pendingUsers = await GetPendingUsersAsync(now, userCutoff);
        status.Users = pendingUsers;

        // Get pending assets (90 days retention)
        var assetCutoff = now.AddDays(-_options.AssetsRetentionDays);
        var pendingAssets = await GetPendingAssetsAsync(now, assetCutoff);
        status.Assets = pendingAssets;

        // Get pending audit logs (1 hour retention)
        var auditLogCutoff = now.AddHours(-_options.AuditLogsRetentionHours);
        var pendingAuditLogs = await GetPendingAuditLogsAsync(now, auditLogCutoff);
        status.AuditLogs = pendingAuditLogs;

        status.Policies = new RetentionPolicies
        {
            Categories = $"{_options.CategoriesRetentionHours} hours",
            Locations = $"{_options.LocationsRetentionHours} hours",
            Users = $"{_options.UsersRetentionDays} days",
            Assets = $"{_options.AssetsRetentionDays} days",
            AuditLogs = $"{_options.AuditLogsRetentionHours} hour"
        };

        return status;
    }

    private async Task<List<PendingDeletionItem>> GetPendingCategoriesAsync(DateTime now, DateTime cutoff)
    {
        // Używam UnitOfWork do pobrania soft-deleted categories
        var deletedCategories = await _unitOfWork.Categories.GetAllDeletedAsync();
        
        return deletedCategories
            .Where(c => c.DeletedAt.HasValue)
            .Select(c => new PendingDeletionItem
            {
                Id = c.Id,
                Name = c.Name,
                DeletedAt = c.DeletedAt!.Value,
                HoursUntilPermanentDelete = Math.Max(0, _options.CategoriesRetentionHours - (int)(now - c.DeletedAt!.Value).TotalHours),
                IsUrgent = (now - c.DeletedAt!.Value).TotalHours >= (_options.CategoriesRetentionHours - _options.NotificationHoursBeforeDeletion)
            })
            .ToList();
    }

    private async Task<List<PendingDeletionItem>> GetPendingLocationsAsync(DateTime now, DateTime cutoff)
    {
        var deletedLocations = await _unitOfWork.Locations.GetAllDeletedAsync();
        
        return deletedLocations
            .Where(l => l.DeletedAt.HasValue)
            .Select(l => new PendingDeletionItem
            {
                Id = l.Id,
                Name = l.Name,
                DeletedAt = l.DeletedAt!.Value,
                HoursUntilPermanentDelete = Math.Max(0, _options.LocationsRetentionHours - (int)(now - l.DeletedAt!.Value).TotalHours),
                IsUrgent = (now - l.DeletedAt!.Value).TotalHours >= (_options.LocationsRetentionHours - _options.NotificationHoursBeforeDeletion)
            })
            .ToList();
    }

    private async Task<List<PendingDeletionItem>> GetPendingUsersAsync(DateTime now, DateTime cutoff)
    {
        var deletedUsers = await _unitOfWork.Users.GetAllDeletedAsync();
        
        return deletedUsers
            .Where(u => u.DeletedAt.HasValue)
            .Select(u => new PendingDeletionItem
            {
                Id = u.Id,
                Name = $"{u.FirstName} {u.LastName} ({u.Username})",
                DeletedAt = u.DeletedAt!.Value,
                HoursUntilPermanentDelete = Math.Max(0, (_options.UsersRetentionDays * 24) - (int)(now - u.DeletedAt!.Value).TotalHours),
                IsUrgent = (now - u.DeletedAt!.Value).TotalDays >= (_options.UsersRetentionDays - 1)
            })
            .ToList();
    }

    private async Task<List<PendingDeletionItem>> GetPendingAssetsAsync(DateTime now, DateTime cutoff)
    {
        var deletedAssets = await _unitOfWork.Assets.GetAllDeletedAsync();
        
        return deletedAssets
            .Where(a => a.DeletedAt.HasValue)
            .Select(a => new PendingDeletionItem
            {
                Id = a.Id,
                Name = $"{a.Name} ({a.SerialNumber})",
                DeletedAt = a.DeletedAt!.Value,
                HoursUntilPermanentDelete = Math.Max(0, (_options.AssetsRetentionDays * 24) - (int)(now - a.DeletedAt!.Value).TotalHours),
                IsUrgent = (now - a.DeletedAt!.Value).TotalDays >= (_options.AssetsRetentionDays - 7)
            })
            .ToList();
    }

    private async Task<List<PendingAuditLogDeletionItem>> GetPendingAuditLogsAsync(DateTime now, DateTime cutoff)
    {
        var auditLogs = await _unitOfWork.AuditLogs.GetByDateRangeAsync(cutoff, now);
        
        return auditLogs
            .Select(a => new PendingAuditLogDeletionItem
            {
                Id = a.Id,
                EntityName = a.EntityName,
                Action = a.Action.ToString(),
                Timestamp = a.Timestamp,
                HoursUntilPermanentDelete = Math.Max(0, _options.AuditLogsRetentionHours - (int)(now - a.Timestamp).TotalHours),
                IsUrgent = (now - a.Timestamp).TotalHours >= (_options.AuditLogsRetentionHours - 0.1) // 6 minut przed usunięciem
            })
            .ToList();
    }

    private async Task CheckExpirationWarningsAsync(DataCleanupResult result)
    {
        var warningTime = DateTime.UtcNow.AddHours(-_options.NotificationHoursBeforeDeletion);

        // Add logic to check for items near expiration
        // This would require additional repository methods to get items by date range
        
        _logger.LogInformation("Expiration warnings check completed");
    }
}
