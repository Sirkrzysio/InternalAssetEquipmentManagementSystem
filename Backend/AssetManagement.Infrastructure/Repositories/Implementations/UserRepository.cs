using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
    }

    public async Task<User?> GetDeletedByIdAsync(Guid id)
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt != null);
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<IEnumerable<User>> GetByRoleAsync(UserRole role)
    {
        return await _context.Users
            .Where(u => u.Role == role)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _context.Users
            .Where(u => u.IsActive)
            .ToListAsync();
    }

    public async Task<(IEnumerable<User> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm = null)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(u => 
                u.FirstName.Contains(searchTerm) || 
                u.LastName.Contains(searchTerm) ||
                u.Email.Contains(searchTerm));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(u => u.LastName)
            .ThenBy(u => u.FirstName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<User> AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        return user;
    }

    public Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.DeletedAt == null);
            
        if (user != null)
        {
            user.DeletedAt = DateTime.UtcNow;
            _context.Users.Update(user);
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }

    public async Task<bool> EmailExistsAsync(string email, Guid? excludeId = null)
    {
        var query = _context.Users.Where(u => u.Email.ToLower() == email.ToLower());
        
        if (excludeId.HasValue)
        {
            query = query.Where(u => u.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }

    public async Task<int> CleanupOldDeletedAsync(DateTime cutoffDate)
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .Where(u => u.DeletedAt != null && u.DeletedAt < cutoffDate)
            .ExecuteDeleteAsync();
    }

    public async Task<int> CleanupAllDeletedAsync()
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .Where(u => u.DeletedAt != null)
            .ExecuteDeleteAsync();
    }

    public async Task<IEnumerable<User>> GetAllDeletedAsync()
    {
        return await _context.Users
            .IgnoreQueryFilters()
            .Where(u => u.DeletedAt != null)
            .OrderByDescending(u => u.DeletedAt)
            .ToListAsync();
    }
}
