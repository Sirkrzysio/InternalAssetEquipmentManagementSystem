using AssetManagement.Application.DTOs.Assignments;
using AssetManagement.Application.DTOs.Common;

namespace AssetManagement.Application.Interfaces;

public interface IAssignmentService
{
    Task<Result<AssignmentDto>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<AssignmentDto>>> GetAllAsync();
    Task<Result<IEnumerable<AssignmentDto>>> GetByAssetIdAsync(Guid assetId);
    Task<Result<IEnumerable<AssignmentDto>>> GetByUserIdAsync(Guid userId);
    Task<Result<PagedResult<AssignmentDto>>> GetPagedAsync(int page, int pageSize);
    Task<Result<AssignmentDto>> CreateAsync(CreateAssignmentDto dto);
    Task<Result> ReturnAssetAsync(Guid assignmentId);
    Task<Result> DeleteAsync(Guid id);
}
