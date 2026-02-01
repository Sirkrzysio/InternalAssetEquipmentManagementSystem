using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Interfaces.Repositories;

public interface ILocationRepository
{
    Task<Location?> GetByIdAsync(Guid id);
    Task<Location?> GetByIdWithAssetsAsync(Guid id);
    Task<Location?> GetDeletedByIdAsync(Guid id);
    Task<IEnumerable<Location>> GetAllAsync();
    Task<IEnumerable<Location>> GetAllDeletedAsync();
    Task<(IEnumerable<Location> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm = null);
    Task<Location> AddAsync(Location location);
    Task UpdateAsync(Location location);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> HasAssetsAsync(Guid id);
    Task<int> CleanupOldDeletedAsync(DateTime cutoffDate);
    Task<int> CleanupAllDeletedAsync();
}
