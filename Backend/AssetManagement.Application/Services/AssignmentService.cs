using AssetManagement.Application.DTOs.Assignments;
using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using AutoMapper;
using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Services;

public class AssignmentService : IAssignmentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AssignmentService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<AssignmentDto>> GetByIdAsync(Guid id)
    {
        var assignment = await _unitOfWork.Assignments.GetByIdWithDetailsAsync(id);
        if (assignment == null)
            return Result<AssignmentDto>.Failure("Przypisanie nie zostało znalezione");

        return Result<AssignmentDto>.Success(_mapper.Map<AssignmentDto>(assignment));
    }

    public async Task<Result<IEnumerable<AssignmentDto>>> GetAllAsync()
    {
        var assignments = await _unitOfWork.Assignments.GetAllAsync();
        return Result<IEnumerable<AssignmentDto>>.Success(_mapper.Map<IEnumerable<AssignmentDto>>(assignments));
    }

    public async Task<Result<IEnumerable<AssignmentDto>>> GetByAssetIdAsync(Guid assetId)
    {
        var assignments = await _unitOfWork.Assignments.GetByAssetIdAsync(assetId);
        return Result<IEnumerable<AssignmentDto>>.Success(_mapper.Map<IEnumerable<AssignmentDto>>(assignments));
    }

    public async Task<Result<IEnumerable<AssignmentDto>>> GetByUserIdAsync(Guid userId)
    {
        var assignments = await _unitOfWork.Assignments.GetByUserIdAsync(userId);
        return Result<IEnumerable<AssignmentDto>>.Success(_mapper.Map<IEnumerable<AssignmentDto>>(assignments));
    }

    public async Task<Result<PagedResult<AssignmentDto>>> GetPagedAsync(int page, int pageSize)
    {
        var (items, totalCount) = await _unitOfWork.Assignments.GetPagedAsync(page, pageSize);
        var dtos = _mapper.Map<IEnumerable<AssignmentDto>>(items);
        return Result<PagedResult<AssignmentDto>>.Success(PagedResult<AssignmentDto>.Create(dtos, totalCount, page, pageSize));
    }

    public async Task<Result<PagedResult<AssignmentDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm, bool? isActive = null)
    {
        var (items, totalCount) = await _unitOfWork.Assignments.GetPagedAsync(page, pageSize, searchTerm, isActive);
        var dtos = _mapper.Map<IEnumerable<AssignmentDto>>(items);
        return Result<PagedResult<AssignmentDto>>.Success(PagedResult<AssignmentDto>.Create(dtos, totalCount, page, pageSize));
    }

    public async Task<Result<IEnumerable<AssignmentDto>>> GetActiveAssignmentsAsync()
    {
        var assignments = await _unitOfWork.Assignments.GetActiveAsync();
        return Result<IEnumerable<AssignmentDto>>.Success(_mapper.Map<IEnumerable<AssignmentDto>>(assignments));
    }

    public async Task<Result<AssignmentDto>> CreateAsync(CreateAssignmentDto dto)
    {
        var asset = await _unitOfWork.Assets.GetByIdAsync(dto.AssetId);
        if (asset == null)
            return Result<AssignmentDto>.Failure("Asset nie istnieje");

        if (asset.Status != AssetStatus.Available)
            return Result<AssignmentDto>.Failure("Asset nie jest dostępny do przypisania");

        if (!await _unitOfWork.Users.ExistsAsync(dto.UserId))
            return Result<AssignmentDto>.Failure("Użytkownik nie istnieje");

        if (await _unitOfWork.Assignments.HasActiveAssignmentAsync(dto.AssetId))
            return Result<AssignmentDto>.Failure("Asset jest już przypisany");

        var assignment = _mapper.Map<Assignment>(dto);
        assignment.Id = Guid.NewGuid();
        assignment.AssignedAt = DateTime.UtcNow;

        asset.Status = AssetStatus.Assigned;

        await _unitOfWork.Assignments.AddAsync(assignment);
        await _unitOfWork.Assets.UpdateAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        var result = await _unitOfWork.Assignments.GetByIdWithDetailsAsync(assignment.Id);
        return Result<AssignmentDto>.Success(_mapper.Map<AssignmentDto>(result));
    }

    public async Task<Result> ReturnAssetAsync(Guid assignmentId)
    {
        var assignment = await _unitOfWork.Assignments.GetByIdAsync(assignmentId);
        if (assignment == null)
            return Result.Failure("Przypisanie nie zostało znalezione");

        if (assignment.ReturnedAt != null)
            return Result.Failure("Asset został już zwrócony");

        var asset = await _unitOfWork.Assets.GetByIdAsync(assignment.AssetId);
        if (asset == null)
            return Result.Failure("Asset nie istnieje");

        assignment.ReturnedAt = DateTime.UtcNow;
        asset.Status = AssetStatus.Available;

        await _unitOfWork.Assignments.UpdateAsync(assignment);
        await _unitOfWork.Assets.UpdateAsync(asset);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var assignment = await _unitOfWork.Assignments.GetByIdAsync(id);
        if (assignment == null)
            return Result.Failure("Przypisanie nie zostało znaleione");

        if (assignment.ReturnedAt == null)
            return Result.Failure("Nie można usunąć aktywnego przypisania");

        await _unitOfWork.Assignments.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<Result<IEnumerable<AssignmentDto>>> BulkReturnAsync(List<Guid> assignmentIds)
    {
        var assignments = new List<AssignmentDto>();
        
        foreach (var assignmentId in assignmentIds)
        {
            var assignment = await _unitOfWork.Assignments.GetByIdAsync(assignmentId);
            if (assignment == null || assignment.ReturnedAt != null)
                continue;

            var asset = await _unitOfWork.Assets.GetByIdAsync(assignment.AssetId);
            if (asset == null)
                continue;

            assignment.ReturnedAt = DateTime.UtcNow;
            asset.Status = AssetStatus.Available;

            await _unitOfWork.Assignments.UpdateAsync(assignment);
            await _unitOfWork.Assets.UpdateAsync(asset);
            
            assignments.Add(_mapper.Map<AssignmentDto>(assignment));
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<IEnumerable<AssignmentDto>>.Success(assignments);
    }
}
