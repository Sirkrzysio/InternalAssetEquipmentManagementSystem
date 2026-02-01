﻿using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Services;

public class AuditService : IAuditService
{
    private readonly IUnitOfWork _unitOfWork;

    public AuditService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task LogAsync(
        string entityName, 
        Guid entityId, 
        AuditAction action, 
        string? oldValues, 
        string? newValues, 
        Guid? userId, 
        string? userName, 
        string? ipAddress)
    {
        var auditLog = new AuditLog
        {
            Id = Guid.NewGuid(),
            EntityName = entityName,
            EntityId = entityId,
            Action = action,
            OldValues = oldValues,
            NewValues = newValues,
            UserId = userId,
            UserName = userName,
            IpAddress = ipAddress,
            Timestamp = DateTime.UtcNow
        };

        await _unitOfWork.AuditLogs.AddAsync(auditLog);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<Result<IEnumerable<AuditLog>>> GetByEntityAsync(string entityName, Guid entityId)
    {
        var logs = await _unitOfWork.AuditLogs.GetByEntityAsync(entityName, entityId);
        return Result<IEnumerable<AuditLog>>.Success(logs);
    }

    public async Task<Result<PagedResult<AuditLog>>> GetPagedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _unitOfWork.AuditLogs.GetPagedAsync(page, pageSize);
        return Result<PagedResult<AuditLog>>.Success(PagedResult<AuditLog>.Create(items, totalCount, page, pageSize));
    }

    public async Task<Result<PagedResult<AuditLog>>> GetPagedAsync(int page, int pageSize, string? searchTerm)
    {
        var (items, totalCount) = await _unitOfWork.AuditLogs.GetPagedAsync(page, pageSize, searchTerm);
        return Result<PagedResult<AuditLog>>.Success(PagedResult<AuditLog>.Create(items, totalCount, page, pageSize));
    }

    public async Task<Result<IEnumerable<AuditLog>>> GetByUserAsync(Guid userId)
    {
        var logs = await _unitOfWork.AuditLogs.GetByUserAsync(userId);
        return Result<IEnumerable<AuditLog>>.Success(logs);
    }
}
