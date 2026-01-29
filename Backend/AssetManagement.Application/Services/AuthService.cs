using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.DTOs.Users;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Security;
using AutoMapper;

namespace AssetManagement.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    public AuthService(
        IUnitOfWork unitOfWork, 
        IMapper mapper, 
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public async Task<Result<LoginResponseDto>> LoginAsync(LoginDto dto)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(dto.Email);
        if (user == null)
            return Result<LoginResponseDto>.Failure("Nieprawidłowy email lub hasło");

        if (!user.IsActive)
            return Result<LoginResponseDto>.Failure("Konto użytkownika jest nieaktywne");

        if (!_passwordHasher.VerifyPassword(dto.Password, user.PasswordHash))
            return Result<LoginResponseDto>.Failure("Nieprawidłowy email lub hasło");

        var token = _jwtTokenGenerator.GenerateToken(user);

        var response = new LoginResponseDto
        {
            Token = token,
            User = _mapper.Map<UserDto>(user),
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };

        return Result<LoginResponseDto>.Success(response);
    }

    public Task<Result> LogoutAsync(Guid userId)
    {
        // W przypadku JWT logout jest po stronie klienta (usunięcie tokena)
        // Opcjonalnie można dodać blacklistę tokenów
        return Task.FromResult(Result.Success());
    }

    public async Task<Result<UserDto>> GetCurrentUserAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
            return Result<UserDto>.Failure("Użytkownik nie został znaleziony");

        return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
    }
}
