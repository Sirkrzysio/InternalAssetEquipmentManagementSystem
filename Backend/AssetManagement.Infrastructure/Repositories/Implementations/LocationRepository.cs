using System.Linq;
using AssetManagement.Domain.Entities;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories.Implementations;

public class LocationRepository : ILocationRepository
{
    private readonly ApplicationDbContext _context;

    public LocationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Location?> GetByIdAsync(Guid id)
    {
        return await _context.Locations.FindAsync(id);
    }

    public async Task<Location?> GetByIdWithAssetsAsync(Guid id)
    {
        return await _context.Locations
            .Include(l => l.Assets)
                .ThenInclude(a => a.Category)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<Location?> GetDeletedByIdAsync(Guid id)
    {
        return await _context.Locations
            .IgnoreQueryFilters()
            .Include(l => l.Assets)
            .FirstOrDefaultAsync(l => l.Id == id && l.DeletedAt != null);
    }

    public async Task<IEnumerable<Location>> GetAllAsync()
    {
        return await _context.Locations.ToListAsync();
    }

    public async Task<(IEnumerable<Location> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm = null)
    {
        var query = _context.Locations.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(l => 
                l.Name.Contains(searchTerm) || 
                (l.Building != null && l.Building.Contains(searchTerm)) ||
                (l.Room != null && l.Room.Contains(searchTerm)));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(l => l.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Location> AddAsync(Location location)
    {
        await _context.Locations.AddAsync(location);
        return location;
    }

    public Task UpdateAsync(Location location)
    {
        _context.Locations.Update(location);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var location = await GetByIdAsync(id);
        if (location != null)
        {
            _context.Locations.Remove(location);
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Locations.AnyAsync(l => l.Id == id);
    }

    public async Task<bool> HasAssetsAsync(Guid id)
    {
        return await _context.Assets.AnyAsync(a => a.LocationId == id);
    }
}
