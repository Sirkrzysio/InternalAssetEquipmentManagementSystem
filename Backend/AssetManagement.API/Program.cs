using AssetManagement.API.Extensions;
using AssetManagement.API.Middleware;
using AssetManagement.API.BackgroundServices;
using AssetManagement.Application;
using AssetManagement.Application.Configuration;
using AssetManagement.Infrastructure;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Data.Seed;
using AssetManagement.Application.Interfaces.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add layers
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddApiServices(builder.Configuration);

// Configuration
builder.Services.Configure<DataRetentionOptions>(
    builder.Configuration.GetSection(DataRetentionOptions.SectionName));

// Background Services
builder.Services.AddHostedService<DataCleanupBackgroundService>();

// Authorization (JWT configured in Infrastructure)
builder.Services.AddAuthorization();

// Build app
var app = builder.Build();

// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Asset Management API v1");
        c.RoutePrefix = string.Empty; // dostęp pod root 
    });
}

// Middleware
app.UseExceptionHandling();
app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseAuditLogging();

app.MapControllers();

// Database Migration & Seeding
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

    // Apply migrations
    await DataSeeder.SeedAsync(dbContext, passwordHasher);
}

app.Run();