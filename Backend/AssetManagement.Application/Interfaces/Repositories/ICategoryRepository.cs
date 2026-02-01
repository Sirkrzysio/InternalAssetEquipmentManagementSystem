﻿using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<AssetManagement.Domain.Entities.Category?> GetByIdAsync(Guid id);
    Task<AssetManagement.Domain.Entities.Category?> GetByIdWithAssetsAsync(Guid id);
    Task<AssetManagement.Domain.Entities.Category?> GetByNameAsync(string name);
    Task<AssetManagement.Domain.Entities.Category?> GetDeletedByIdAsync(Guid id);
    Task<IEnumerable<AssetManagement.Domain.Entities.Category>> GetAllAsync();
    Task<(IEnumerable<AssetManagement.Domain.Entities.Category> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm = null);
    Task<AssetManagement.Domain.Entities.Category> AddAsync(AssetManagement.Domain.Entities.Category category);
    Task UpdateAsync(AssetManagement.Domain.Entities.Category category);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> HasAssetsAsync(Guid id);
    Task<bool> NameExistsAsync(string name, Guid? excludeId = null);
}
