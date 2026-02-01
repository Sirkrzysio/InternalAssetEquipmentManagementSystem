﻿namespace AssetManagement.Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IAssetRepository Assets { get; }
    IAssignmentRepository Assignments { get; }
    IUserRepository Users { get; }
    ILocationRepository Locations { get; }
    ICategoryRepository Categories { get; }
    IAuditLogRepository AuditLogs { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
