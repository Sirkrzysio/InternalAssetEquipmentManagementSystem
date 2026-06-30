﻿using System.Linq;
using AssetManagement.Domain.Entities;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Application.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Repositories.Implementations;

public class AssignmentRepository : IAssignmentRepository
{
    private readonly ApplicationDbContext _context;

    public AssignmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Assignment?> GetByIdAsync(Guid id)
    {
        return await _context.Assignments.FindAsync(id);
    }

    public async Task<Assignment?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _context.Assignments
            .Include(a => a.Asset)
                .ThenInclude(asset => asset.Category)
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task<IEnumerable<Assignment>> GetAllAsync()
    {
        return await _context.Assignments
            .Include(a => a.Asset)
            .Include(a => a.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Assignment>> GetByAssetIdAsync(Guid assetId)
    {
        return await _context.Assignments
            .Where(a => a.AssetId == assetId)
            .Include(a => a.User)
            .OrderByDescending(a => a.AssignedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Assignment>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Assignments
            .Where(a => a.UserId == userId)
            .Include(a => a.Asset)
                .ThenInclude(asset => asset.Category)
            .OrderByDescending(a => a.AssignedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Assignment>> GetActiveAssignmentsAsync()
    {
        return await _context.Assignments
            .Where(a => a.ReturnedAt == null)
            .Include(a => a.Asset)
            .Include(a => a.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Assignment>> GetActiveAsync()
    {
        return await GetActiveAssignmentsAsync();
    }

    public async Task<Assignment?> GetActiveAssignmentForAssetAsync(Guid assetId)
    {
        return await _context.Assignments
            .Where(a => a.AssetId == assetId && a.ReturnedAt == null)
            .Include(a => a.User)
            .FirstOrDefaultAsync();
    }

    public async Task<(IEnumerable<Assignment> Items, int TotalCount)> GetPagedAsync(int page, int pageSize)
    {
        var query = _context.Assignments
            .Include(a => a.Asset)
            .Include(a => a.User)
            .AsQueryable();

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.AssignedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<(IEnumerable<Assignment> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, string? searchTerm, bool? isActive = null)
    {
        var query = _context.Assignments
            .Include(a => a.Asset)
            .Include(a => a.User)
            .AsQueryable();

        if (isActive.HasValue)
        {
            query = isActive.Value
                ? query.Where(a => a.ReturnedAt == null)
                : query.Where(a => a.ReturnedAt != null);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(a => 
                a.Asset.Name.Contains(searchTerm) ||
                a.Asset.SerialNumber.Contains(searchTerm) ||
                a.User.FirstName.Contains(searchTerm) ||
                a.User.LastName.Contains(searchTerm) ||
                a.User.Email.Contains(searchTerm));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(a => a.AssignedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Assignment> AddAsync(Assignment assignment)
    {
        await _context.Assignments.AddAsync(assignment);
        return assignment;
    }

    public Task UpdateAsync(Assignment assignment)
    {
        _context.Assignments.Update(assignment);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var assignment = await GetByIdAsync(id);
        if (assignment != null)
        {
            _context.Assignments.Remove(assignment);
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Assignments.AnyAsync(a => a.Id == id);
    }

    public async Task<bool> HasActiveAssignmentAsync(Guid assetId)
    {
        return await _context.Assignments
            .AnyAsync(a => a.AssetId == assetId && a.ReturnedAt == null);
    }
}
