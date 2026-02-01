using AssetManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DataRetentionController : ControllerBase
{
    private readonly IDataCleanupService _dataCleanupService;
    private readonly ILogger<DataRetentionController> _logger;

    public DataRetentionController(
        IDataCleanupService dataCleanupService,
        ILogger<DataRetentionController> logger)
    {
        _dataCleanupService = dataCleanupService;
        _logger = logger;
    }

    [HttpGet("status")]
    public async Task<IActionResult> GetRetentionStatus()
    {
        try
        {
            var status = await _dataCleanupService.GetRetentionStatusAsync();
            return Ok(status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting retention status");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("cleanup")]
    public async Task<IActionResult> ExecuteManualCleanup()
    {
        try
        {
            var result = await _dataCleanupService.PerformCleanupAsync(ignoreRetention: true);
            
            return Ok(new
            {
                message = "Manual cleanup executed successfully",
                executedAt = result.ExecutedAt,
                deletedCounts = new
                {
                    categories = result.CategoriesDeleted,
                    locations = result.LocationsDeleted,
                    users = result.UsersDeleted,
                    assets = result.AssetsDeleted,
                    auditLogs = result.AuditLogsDeleted
                },
                warnings = result.Warnings
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during manual cleanup");
            return StatusCode(500, "Internal server error during cleanup");
        }
    }
}
