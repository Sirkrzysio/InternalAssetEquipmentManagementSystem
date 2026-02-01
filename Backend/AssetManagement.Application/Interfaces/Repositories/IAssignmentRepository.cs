﻿using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Interfaces.Repositories;

public interface IAssignmentRepository
{
    Task<Assignment?> GetByIdAsync(Guid id);
    Task<Assignment?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<Assignment>> GetAllAsync();
    Task<IEnumerable<Assignment>> GetByAssetIdAsync(Guid assetId);
    Task<IEnumerable<Assignment>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Assignment>> GetActiveAssignmentsAsync();
    Task<IEnumerable<Assignment>> GetActiveAsync();
    Task<Assignment?> GetActiveAssignmentForAssetAsync(Guid assetId);
    Task<(IEnumerable<Assignment> Items, int TotalCount)> GetPagedAsync(int page, int pageSize);
    Task<(IEnumerable<Assignment> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm);
    Task<Assignment> AddAsync(Assignment assignment);
    Task UpdateAsync(Assignment assignment);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> HasActiveAssignmentAsync(Guid assetId);
}
