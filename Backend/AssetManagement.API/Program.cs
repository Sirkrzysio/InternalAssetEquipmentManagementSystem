using AssetManagement.API.Extensions;
using AssetManagement.API.Middleware;
using AssetManagement.Application;
using AssetManagement.Infrastructure;
using AssetManagement.Infrastructure.Data;
using AssetManagement.Infrastructure.Data.Seed;
using AssetManagement.Application.Interfaces.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ===== Add layers =====
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddApiServices(builder.Configuration);

// ===== Authorization only (JWT configured in Infrastructure) =====
builder.Services.AddAuthorization();


// ===== Build app =====
var app = builder.Build();

// ===== Swagger =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Asset Management API v1");
        c.RoutePrefix = string.Empty; // dostęp pod root (opcjonalnie)
    });
}

// ===== Middleware =====
app.UseExceptionHandling();
app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ===== Database Migration & Seeding =====
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

    // ❌ NIE MIGRUJ AUTOMATYCZNIE
    // await dbContext.Database.MigrateAsync();

    // ✔️ Seed tylko gdy baza już istnieje
    await DataSeeder.SeedAsync(dbContext, passwordHasher);
}


// ===== Run =====
app.Run();