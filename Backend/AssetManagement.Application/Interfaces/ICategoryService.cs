using AssetManagement.Application.DTOs.Categories;
using AssetManagement.Application.DTOs.Common;

namespace AssetManagement.Application.Interfaces;

public interface ICategoryService
{
    Task<Result<CategoryDto>> GetByIdAsync(Guid id);
    Task<Result<IEnumerable<CategoryDto>>> GetAllAsync();
    Task<Result<PagedResult<CategoryDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null);
    Task<Result<CategoryDto>> CreateAsync(CreateCategoryDto dto);
    Task<Result<CategoryDto>> UpdateAsync(Guid id, CreateCategoryDto dto);
    Task<Result> DeleteAsync(Guid id);
}
