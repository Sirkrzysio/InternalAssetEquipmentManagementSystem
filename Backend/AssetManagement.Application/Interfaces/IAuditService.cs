﻿using AssetManagement.Application.DTOs.Common;
using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Interfaces;

public interface IAuditService
{
    Task LogAsync(string entityName, Guid entityId, AuditAction action, string? oldValues, string? newValues, Guid? userId, string? userName, string? ipAddress);
    Task<Result<IEnumerable<AuditLog>>> GetByEntityAsync(string entityName, Guid entityId);
    Task<Result<PagedResult<AuditLog>>> GetPagedAsync(int page, int pageSize);
    Task<Result<PagedResult<AuditLog>>> GetPagedAsync(int page, int pageSize, string? searchTerm);
    Task<Result<IEnumerable<AuditLog>>> GetByUserAsync(Guid userId);
}
