using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AssetManagement.Infrastructure.Repositories.Implementations;

public class AssetRepository : IAssetRepository
{
    private readonly ApplicationDbContext _context;

    public AssetRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Asset?> GetByIdAsync(Guid id)
    {
        return await _context.Assets.FindAsync(id);
    }

    public async Task<Asset?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _context.Assets
            .Include(a => a.Category)
            .Include(a => a.Location)
            .Include(a => a.Assignments)
                .ThenInclude(ass => ass.User)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<Asset?> GetBySerialNumberAsync(string serialNumber)
    {
        return await _context.Assets
            .FirstOrDefaultAsync(a => a.SerialNumber == serialNumber);
    }

    public async Task<Asset?> GetDeletedByIdAsync(Guid id)
    {
        return await _context.Assets
            .IgnoreQueryFilters()
            .Include(a => a.Category)
            .Include(a => a.Location)
            .FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt != null);
    }

    public async Task<IEnumerable<Asset>> GetAllAsync()
    {
        return await _context.Assets
            .Include(a => a.Category)
            .Include(a => a.Location)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetByStatusAsync(AssetStatus status)
    {
        return await _context.Assets
            .Where(a => a.Status == status)
            .Include(a => a.Category)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetByStatusAsync(string status)
    {
        if (Enum.TryParse<AssetStatus>(status, true, out var assetStatus))
        {
            return await GetByStatusAsync(assetStatus);
        }
        return Enumerable.Empty<Asset>();
    }

    public async Task<IEnumerable<Asset>> GetByCategoryAsync(Guid categoryId)
    {
        return await _context.Assets
            .Where(a => a.CategoryId == categoryId)
            .Include(a => a.Location)
            .ToListAsync();
    }

    public async Task<IEnumerable<Asset>> GetByLocationAsync(Guid locationId)
    {
        return await _context.Assets
            .Where(a => a.LocationId == locationId)
            .Include(a => a.Category)
            .ToListAsync();
    }

    public async Task<(IEnumerable<Asset> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm = null, AssetStatus? status = null)
    {
        var query = _context.Assets
            .Include(a => a.Category)
            .Include(a => a.Location)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(a => a.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(a => 
                a.Name.Contains(searchTerm) || 
                a.SerialNumber.Contains(searchTerm) ||
                (a.Description != null && a.Description.Contains(searchTerm)));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(a => a.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Asset> AddAsync(Asset asset)
    {
        await _context.Assets.AddAsync(asset);
        return asset;
    }

    public Task UpdateAsync(Asset asset)
    {
        _context.Assets.Update(asset);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var asset = await _context.Assets
            .FirstOrDefaultAsync(a => a.Id == id && a.DeletedAt == null);
            
        if (asset != null)
        {
            asset.DeletedAt = DateTime.UtcNow;
            _context.Assets.Update(asset);
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Assets.AnyAsync(a => a.Id == id);
    }

    public async Task<bool> SerialNumberExistsAsync(string serialNumber, Guid? excludeId = null)
    {
        var query = _context.Assets.Where(a => a.SerialNumber == serialNumber);
        
        if (excludeId.HasValue)
        {
            query = query.Where(a => a.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task<int> CleanupOldDeletedAsync(DateTime cutoffDate)
    {
        return await _context.Assets
            .IgnoreQueryFilters()
            .Where(a => a.DeletedAt != null && a.DeletedAt < cutoffDate)
            .ExecuteDeleteAsync();
    }

    public async Task<int> CleanupAllDeletedAsync()
    {
        return await _context.Assets
            .IgnoreQueryFilters()
            .Where(a => a.DeletedAt != null)
            .ExecuteDeleteAsync();
    }

    public async Task<IEnumerable<Asset>> GetAllDeletedAsync()
    {
        return await _context.Assets
            .IgnoreQueryFilters()
            .Where(a => a.DeletedAt != null)
            .Include(a => a.Category)
            .Include(a => a.Location)
            .OrderByDescending(a => a.DeletedAt)
            .ToListAsync();
    }
}
