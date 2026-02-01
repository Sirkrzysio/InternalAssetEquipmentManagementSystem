using AssetManagement.Application.DTOs.Users;
using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _userService.GetAllAsync();
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? searchTerm = null)
    {
        var result = await _userService.GetPagedAsync(page, pageSize, searchTerm);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _userService.GetByIdAsync(id);
        if (!result.IsSuccess)
            return NotFound(result.Error);

        return Ok(result.Data);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        var result = await _userService.CreateAsync(dto);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return CreatedAtAction(nameof(GetById), new { id = result.Data!.Id }, result.Data);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserDto dto)
    {
        var result = await _userService.UpdateAsync(id, dto);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _userService.DeleteAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [HttpPost("{id:guid}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deactivate(Guid id)
    {
        var result = await _userService.DeactivateAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok();
    }

    [HttpPost("{id:guid}/activate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Activate(Guid id)
    {
        var result = await _userService.ActivateAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok();
    }

    [HttpPost("{id:guid}/restore")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Restore(Guid id)
    {
        var result = await _userService.RestoreAsync(id);
        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Data);
    }
}
