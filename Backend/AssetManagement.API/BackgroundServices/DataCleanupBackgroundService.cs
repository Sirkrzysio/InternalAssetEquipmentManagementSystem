using AssetManagement.Application.Configuration;
using AssetManagement.Application.Interfaces;
using Microsoft.Extensions.Options;

namespace AssetManagement.API.BackgroundServices;

public class DataCleanupBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DataCleanupBackgroundService> _logger;
    private readonly DataRetentionOptions _options;

    public DataCleanupBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<DataCleanupBackgroundService> logger,
        IOptions<DataRetentionOptions> options)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _options = options.Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Data cleanup background service started");
        
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var cleanupService = scope.ServiceProvider.GetRequiredService<IDataCleanupService>();
                
                var result = await cleanupService.PerformCleanupAsync();
                
                _logger.LogInformation(
                    "Background cleanup completed at {ExecutedAt}: {Categories} categories, {Locations} locations, {Users} users, {Assets} assets deleted",
                    result.ExecutedAt, result.CategoriesDeleted, result.LocationsDeleted, result.UsersDeleted, result.AssetsDeleted);
                
                // Wait 24 hours before next cleanup
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in data cleanup background service");
                // Wait 1 hour before retry on error
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
        
        _logger.LogInformation("Data cleanup background service stopped");
    }
}
