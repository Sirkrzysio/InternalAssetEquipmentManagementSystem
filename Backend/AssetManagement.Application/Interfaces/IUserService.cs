﻿﻿using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.DTOs.Users;

namespace AssetManagement.Application.Interfaces;

public interface IUserService
{
    Task<Result<UserDto>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<UserDto>>> GetAllAsync();
    Task<Result<PagedResult<UserDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null);
    Task<Result<UserDto>> CreateAsync(CreateUserDto dto);
    Task<Result<UserDto>> UpdateAsync(Guid id, UpdateUserDto dto);
    Task<Result> DeleteAsync(Guid id);
    Task<Result> DeactivateAsync(Guid id);
    Task<Result> ActivateAsync(Guid id);
    Task<Result<UserDto>> RestoreAsync(Guid id);
}
