using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.DTOs.Users;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Security;
using AutoMapper;
using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Services;

public class UserService : IUserService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUnitOfWork unitOfWork, IMapper mapper, IPasswordHasher passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _passwordHasher = passwordHasher;
    }

    public async Task<Result<UserDto>> GetByIdAsync(Guid id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null)
            return Result<UserDto>.Failure("Użytkownik nie został znaleziony");

        return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
    }

    public async Task<Result<IEnumerable<UserDto>>> GetAllAsync()
    {
        var users = await _unitOfWork.Users.GetAllAsync();
        return Result<IEnumerable<UserDto>>.Success(_mapper.Map<IEnumerable<UserDto>>(users));
    }

    public async Task<Result<PagedResult<UserDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null, bool? isActive = null, AssetManagement.Domain.Enums.UserRole? role = null)
    {
        var (items, totalCount) = await _unitOfWork.Users.GetPagedAsync(page, pageSize, searchTerm, isActive, role);
        var dtos = _mapper.Map<IEnumerable<UserDto>>(items);
        return Result<PagedResult<UserDto>>.Success(PagedResult<UserDto>.Create(dtos, totalCount, page, pageSize));
    }

    public async Task<Result<UserDto>> CreateAsync(CreateUserDto dto)
    {
        if (await _unitOfWork.Users.EmailExistsAsync(dto.Email))
            return Result<UserDto>.Failure("Użytkownik z tym adresem email już istnieje");

        var user = _mapper.Map<User>(dto);
        user.Id = Guid.NewGuid();
        user.PasswordHash = _passwordHasher.HashPassword(dto.Password);

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
    }

    public async Task<Result<UserDto>> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null)
            return Result<UserDto>.Failure("Użytkownik nie został znaleziony");

        if (await _unitOfWork.Users.EmailExistsAsync(dto.Email, id))
            return Result<UserDto>.Failure("Użytkownik z tym adresem email już istnieje");

        _mapper.Map(dto, user);
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        if (!await _unitOfWork.Users.ExistsAsync(id))
            return Result.Failure("Użytkownik nie został znaleziony");

        await _unitOfWork.Users.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> DeactivateAsync(Guid id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null)
            return Result.Failure("Użytkownik nie został znaleziony");

        user.IsActive = false;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> ActivateAsync(Guid id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);
        if (user == null)
            return Result.Failure("Użytkownik nie został znaleziony");

        user.IsActive = true;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result<UserDto>> RestoreAsync(Guid id)
    {
        var user = await _unitOfWork.Users.GetDeletedByIdAsync(id);
        if (user == null)
            return Result<UserDto>.Failure("Usunięty użytkownik nie został znaleziony");

        user.DeletedAt = null;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return Result<UserDto>.Success(_mapper.Map<UserDto>(user));
    }
}
