using AssetManagement.Application.DTOs.Categories;
using AssetManagement.Application.DTOs.Common;
using AssetManagement.Application.Interfaces;
using AssetManagement.Application.Interfaces.Repositories;
using AutoMapper;
using AssetManagement.Domain.Entities;

namespace AssetManagement.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CategoryDto>> GetByIdAsync(Guid id)
    {
        var category = await _unitOfWork.Categories.GetByIdWithAssetsAsync(id);
        if (category == null)
            return Result<CategoryDto>.Failure("Kategoria nie została znaleziona");

        return Result<CategoryDto>.Success(_mapper.Map<CategoryDto>(category));
    }

    public async Task<Result<IEnumerable<CategoryDto>>> GetAllAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        return Result<IEnumerable<CategoryDto>>.Success(_mapper.Map<IEnumerable<CategoryDto>>(categories));
    }

    public async Task<Result<PagedResult<CategoryDto>>> GetPagedAsync(int page, int pageSize, string? searchTerm = null)
    {
        var (items, totalCount) = await _unitOfWork.Categories.GetPagedAsync(page, pageSize, searchTerm);
        var dtos = _mapper.Map<IEnumerable<CategoryDto>>(items);
        return Result<PagedResult<CategoryDto>>.Success(PagedResult<CategoryDto>.Create(dtos, totalCount, page, pageSize));
    }

    public async Task<Result<CategoryDto>> CreateAsync(CreateCategoryDto dto)
    {
        if (await _unitOfWork.Categories.NameExistsAsync(dto.Name))
            return Result<CategoryDto>.Failure("Kategoria o tej nazwie już istnieje");

        var category = _mapper.Map<Category>(dto);
        category.Id = Guid.NewGuid();

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return Result<CategoryDto>.Success(_mapper.Map<CategoryDto>(category));
    }

    public async Task<Result<CategoryDto>> UpdateAsync(Guid id, CreateCategoryDto dto)
    {
        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
            return Result<CategoryDto>.Failure("Kategoria nie została znaleziona");

        if (await _unitOfWork.Categories.NameExistsAsync(dto.Name, id))
            return Result<CategoryDto>.Failure("Kategoria o tej nazwie już istnieje");

        _mapper.Map(dto, category);
        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return Result<CategoryDto>.Success(_mapper.Map<CategoryDto>(category));
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        if (!await _unitOfWork.Categories.ExistsAsync(id))
            return Result.Failure("Kategoria nie została znaleziona");

        if (await _unitOfWork.Categories.HasAssetsAsync(id))
            return Result.Failure("Nie można usunąć kategorii, która zawiera assety");

        await _unitOfWork.Categories.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();

        return Result.Success();
    }
}
