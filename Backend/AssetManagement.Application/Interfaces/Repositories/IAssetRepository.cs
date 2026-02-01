using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Interfaces.Repositories;

public interface IAssetRepository
{
    Task<Asset?> GetByIdAsync(Guid id);
    Task<Asset?> GetByIdWithDetailsAsync(Guid id);
    Task<Asset?> GetBySerialNumberAsync(string serialNumber);
    Task<Asset?> GetDeletedByIdAsync(Guid id);
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<IEnumerable<Asset>> GetAllDeletedAsync();
    Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status);
    Task<IEnumerable<Asset>> GetByStatusAsync(string status);
    Task<IEnumerable<Asset>> GetByCategoryAsync(Guid categoryId);
    Task<IEnumerable<Asset>> GetByLocationAsync(Guid locationId);
    Task<(IEnumerable<Asset> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm = null);
    Task<Asset> AddAsync(Asset asset);
    Task UpdateAsync(Asset asset);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> SerialNumberExistsAsync(string serialNumber, Guid? excludeId = null);
    Task<int> CleanupOldDeletedAsync(DateTime cutoffDate);
    Task<int> CleanupAllDeletedAsync();
}
