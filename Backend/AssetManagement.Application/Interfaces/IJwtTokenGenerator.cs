using System.Security.Claims;

namespace AssetManagement.Application.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(AssetManagement.Domain.Entities.User user);
    ClaimsPrincipal? ValidateToken(string token);
}
