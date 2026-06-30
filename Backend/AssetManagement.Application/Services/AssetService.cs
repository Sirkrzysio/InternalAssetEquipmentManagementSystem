using AssetManagement.Application.DTOs.Assets;
using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Domain.Entities;
using AutoMapper;

namespace AssetManagement.Application.Services;

public class AssetService : IAssetService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AssetService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<AssetDto>> GetByIdAsync(Guid id)
    {
        var asset = await _unitOfWork.Assets.GetByIdWithDetailsAsync(id);
        if (asset == null)
            return Result<AssetDto>.Failure("Asset nie został znaleziony");

        return Result<AssetDto>.Success(_mapper.Map<AssetDto>(asset));
    }

    public async Task<Result<IEnumerable<AssetDto>>> GetAllAsync()
    {
        var assets = await _unitOfWork.Assets.GetAllAsync();
        return Result<IEnumerable<AssetDto>>.Success(_mapper.Map<IEnumerable<AssetDto>>(assets));
    }

    public async Task<Result<PagedResult<AssetDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null, AssetManagement.Domain.Enums.AssetStatus? status = null)
    {
        var (items, totalCount) = await _unitOfWork.Assets.GetPagedAsync(page, pageSize, searchTerm, status);
        var dtos = _mapper.Map<IEnumerable<AssetDto>>(items);
        return Result<PagedResult<AssetDto>>.Success(PagedResult<AssetDto>.Create(dtos, totalCount, page, pageSize));
    }

    public async Task<Result<AssetDto>> CreateAsync(CreateAssetDto dto)
    {
        if (await _unitOfWork.Assets.SerialNumberExistsAsync(dto.SerialNumber))
            return Result<AssetDto>.Failure("Asset z tym numerem seryjnym już istnieje");

        if (!await _unitOfWork.Categories.ExistsAsync(dto.CategoryId))
            return Result<AssetDto>.Failure("Kategoria nie istnieje");

        if (dto.LocationId.HasValue && !await _unitOfWork.Locations.ExistsAsync(dto.LocationId.Value))
            return Result<AssetDto>.Failure("Lokalizacja nie istnieje");

        var asset = _mapper.Map<Asset>(dto);
        asset.Id = Guid.NewGuid();

        await _unitOfWork.Assets.AddAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        var result = await _unitOfWork.Assets.GetByIdWithDetailsAsync(asset.Id);
        return Result<AssetDto>.Success(_mapper.Map<AssetDto>(result));
    }

    public async Task<Result<AssetDto>> UpdateAsync(Guid id, UpdateAssetDto dto)
    {
        var asset = await _unitOfWork.Assets.GetByIdAsync(id);
        if (asset == null)
            return Result<AssetDto>.Failure("Asset nie został znaleziony");

        if (await _unitOfWork.Assets.SerialNumberExistsAsync(dto.SerialNumber, id))
            return Result<AssetDto>.Failure("Asset z tym numerem seryjnym już istnieje");

        if (!await _unitOfWork.Categories.ExistsAsync(dto.CategoryId))
            return Result<AssetDto>.Failure("Kategoria nie istnieje");

        if (dto.LocationId.HasValue && !await _unitOfWork.Locations.ExistsAsync(dto.LocationId.Value))
            return Result<AssetDto>.Failure("Lokalizacja nie istnieje");

        _mapper.Map(dto, asset);
        await _unitOfWork.Assets.UpdateAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        var result = await _unitOfWork.Assets.GetByIdWithDetailsAsync(id);
        return Result<AssetDto>.Success(_mapper.Map<AssetDto>(result));
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        if (!await _unitOfWork.Assets.ExistsAsync(id))
            return Result.Failure("Asset nie został znaleziony");

        if (await _unitOfWork.Assignments.HasActiveAssignmentAsync(id))
            return Result.Failure("Nie można usunąć assetu, który jest przypisany");

        await _unitOfWork.Assets.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result<IEnumerable<AssetDto>>> GetByCategoryAsync(Guid categoryId)
    {
        var assets = await _unitOfWork.Assets.GetByCategoryAsync(categoryId);
        return Result<IEnumerable<AssetDto>>.Success(_mapper.Map<IEnumerable<AssetDto>>(assets));
    }

    public async Task<Result<IEnumerable<AssetDto>>> GetByStatusAsync(string status)
    {
        var assets = await _unitOfWork.Assets.GetByStatusAsync(status);
        return Result<IEnumerable<AssetDto>>.Success(_mapper.Map<IEnumerable<AssetDto>>(assets));
    }

    public async Task<Result<IEnumerable<AssetDto>>> GetByLocationAsync(Guid locationId)
    {
        var assets = await _unitOfWork.Assets.GetByLocationAsync(locationId);
        return Result<IEnumerable<AssetDto>>.Success(_mapper.Map<IEnumerable<AssetDto>>(assets));
    }

    public async Task<Result<AssetDto>> RestoreAsync(Guid id)
    {
        var asset = await _unitOfWork.Assets.GetDeletedByIdAsync(id);
        if (asset == null)
            return Result<AssetDto>.Failure("Usunięty asset nie został znaleziony");

        asset.DeletedAt = null;
        await _unitOfWork.Assets.UpdateAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        var result = await _unitOfWork.Assets.GetByIdWithDetailsAsync(id);
        return Result<AssetDto>.Success(_mapper.Map<AssetDto>(result));
    }
}
