﻿using AssetManagement.Application.DTOs.Assets;
using AssetManagement.Application.DTOs.Common;

namespace AssetManagement.Application.Interfaces;

public interface IAssetService
{
    Task<Result<AssetDto>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<AssetDto>>> GetAllAsync();
    Task<Result<PagedResult<AssetDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null);
    Task<Result<IEnumerable<AssetDto>>> GetByCategoryAsync(Guid categoryId);
    Task<Result<IEnumerable<AssetDto>>> GetByStatusAsync(string status);
    Task<Result<IEnumerable<AssetDto>>> GetByLocationAsync(Guid locationId);
    Task<Result<AssetDto>> CreateAsync(CreateAssetDto dto);
    Task<Result<AssetDto>> UpdateAsync(Guid id, UpdateAssetDto dto);
    Task<Result> DeleteAsync(Guid id);
    Task<Result<AssetDto>> RestoreAsync(Guid id);
}
