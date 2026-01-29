using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.DTOs.Users;

namespace AssetManagement.Application.Interfaces;

public interface IAuthService
{
    Task<Result<LoginResponseDto>> LoginAsync(LoginDto dto);
    Task<Result> LogoutAsync(Guid userId);
    Task<Result<UserDto>> GetCurrentUserAsync(Guid userId);
}
