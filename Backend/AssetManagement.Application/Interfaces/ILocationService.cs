﻿﻿using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.DTOs.Locations;

namespace AssetManagement.Application.Interfaces;

public interface ILocationService
{
    Task<Result<LocationDto>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<LocationDto>>> GetAllAsync();
    Task<Result<PagedResult<LocationDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null);
    Task<Result<LocationDto>> CreateAsync(CreateLocationDto dto);
    Task<Result<LocationDto>> UpdateAsync(Guid id, UpdateLocationDto dto);
    Task<Result> DeleteAsync(Guid id);
    Task<Result<LocationDto>> RestoreAsync(Guid id);
}
