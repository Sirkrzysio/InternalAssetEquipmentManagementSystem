﻿using AssetManagement.Application.DTOs.Assets;
using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;

    public AssetsController(IAssetService assetService)
    {
        _assetService = assetService;
    }
    

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _assetService.GetAllAsync();
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }
    
    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? searchTerm = null)
    {
        var result = await _assetService.GetPagedAsync(page, pageSize, searchTerm);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _assetService.GetByIdAsync(id);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("category/{categoryId:guid}")]
    public async Task<IActionResult> GetByCategory(Guid categoryId)
    {
        var result = await _assetService.GetByCategoryAsync(categoryId);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetByStatus(string status)
    {
        var result = await _assetService.GetByStatusAsync(status);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("location/{locationId:guid}")]
    public async Task<IActionResult> GetByLocation(Guid locationId)
    {
        var result = await _assetService.GetByLocationAsync(locationId);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateAssetDto dto)
    {
        var result = await _assetService.CreateAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAssetDto dto)
    {
        var result = await _assetService.UpdateAsync(id, dto);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _assetService.DeleteAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPost("{id:guid}/restore")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Restore(Guid id)
    {
        var result = await _assetService.RestoreAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }
}
