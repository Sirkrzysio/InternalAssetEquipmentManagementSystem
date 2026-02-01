﻿using AssetManagement.Application.DTOs.Assignments;
using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly IAssignmentService _assignmentService;

    public AssignmentsController(IAssignmentService assignmentService)
    {
        _assignmentService = assignmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _assignmentService.GetAllAsync();
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? searchTerm = null)
    {
        var result = await _assignmentService.GetPagedAsync(page, pageSize, searchTerm);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _assignmentService.GetByIdAsync(id);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("asset/{assetId:guid}")]
    public async Task<IActionResult> GetByAssetId(Guid assetId)
    {
        var result = await _assignmentService.GetByAssetIdAsync(assetId);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetByUserId(Guid userId)
    {
        var result = await _assignmentService.GetByUserIdAsync(userId);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentDto dto)
    {
        var result = await _assignmentService.CreateAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    [HttpPost("{id:guid}/return")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> ReturnAsset(Guid id)
    {
        var result = await _assignmentService.ReturnAssetAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _assignmentService.DeleteAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPost("bulk-return")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> BulkReturn([FromBody] List<Guid> assignmentIds)
    {
        var result = await _assignmentService.BulkReturnAsync(assignmentIds);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveAssignments()
    {
        var result = await _assignmentService.GetActiveAssignmentsAsync();
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }
}
