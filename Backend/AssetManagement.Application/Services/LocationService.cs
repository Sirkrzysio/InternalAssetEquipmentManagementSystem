using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.DTOs.Locations;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using AutoMapper;
using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Services;

public class LocationService : ILocationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public LocationService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<LocationDto>> GetByIdAsync(Guid id)
    {
        var location = await _unitOfWork.Locations.GetByIdWithAssetsAsync(id);
        if (location == null)
            return Result<LocationDto>.Failure("Lokalizacja nie zostala znaleziona");

        return Result<LocationDto>.Success(_mapper.Map<LocationDto>(location));
    }

    public async Task<Result<IEnumerable<LocationDto>>> GetAllAsync()
    {
        var locations = await _unitOfWork.Locations.GetAllAsync();
        return Result<IEnumerable<LocationDto>>.Success(_mapper.Map<IEnumerable<LocationDto>>(locations));
    }

    public async Task<Result<PagedResult<LocationDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null)
    {
        var (items, totalCount) = await _unitOfWork.Locations.GetPagedAsync(page, pageSize, searchTerm);
        var dtos = _mapper.Map<IEnumerable<LocationDto>>(items);
        return Result<PagedResult<LocationDto>>.Success(PagedResult<LocationDto>.Create(dtos, totalCount, page, pageSize));
    }

    public async Task<Result<LocationDto>> CreateAsync(CreateLocationDto dto)
    {
        var location = _mapper.Map<Location>(dto);
        location.Id = Guid.NewGuid();

        await _unitOfWork.Locations.AddAsync(location);
        await _unitOfWork.SaveChangesAsync();

        return Result<LocationDto>.Success(_mapper.Map<LocationDto>(location));
    }

    public async Task<Result<LocationDto>> UpdateAsync(Guid id, UpdateLocationDto dto)
    {
        var location = await _unitOfWork.Locations.GetByIdAsync(id);
        if (location == null)
            return Result<LocationDto>.Failure("Lokalizacja nie zostala znaleziona");

        _mapper.Map(dto, location);
        await _unitOfWork.Locations.UpdateAsync(location);
        await _unitOfWork.SaveChangesAsync();

        var result = await _unitOfWork.Locations.GetByIdWithAssetsAsync(id);
        if (result == null)
            return Result<LocationDto>.Failure("Lokalizacja nie zostala znaleziona");

        return Result<LocationDto>.Success(_mapper.Map<LocationDto>(result));
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        if (!await _unitOfWork.Locations.ExistsAsync(id))
            return Result.Failure("Lokalizacja nie zostala znaleziona");

        if (await _unitOfWork.Locations.HasAssetsAsync(id))
            return Result.Failure("Nie mozna usunac lokalizacji ktora zawiera assety");

        await _unitOfWork.Locations.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result<LocationDto>> RestoreAsync(Guid id)
    {
        var location = await _unitOfWork.Locations.GetDeletedByIdAsync(id);
        if (location == null)
            return Result<LocationDto>.Failure("Usunięta lokalizacja nie została znaleziona");

        location.DeletedAt = null;
        await _unitOfWork.Locations.UpdateAsync(location);
        await _unitOfWork.SaveChangesAsync();

        return Result<LocationDto>.Success(_mapper.Map<LocationDto>(location));
    }
}
