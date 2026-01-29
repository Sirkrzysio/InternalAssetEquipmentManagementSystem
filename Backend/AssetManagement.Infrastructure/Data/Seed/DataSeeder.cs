using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Enums;
using AssetManagement.Application.Interfaces.Security;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Data.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, IPasswordHasher passwordHasher)
    {
        if (await context.Users.AnyAsync())
        {
            return; // Database has been seeded
        }

        // Seed Categories
        var categories = new List<Category>
        {
            new() { Id = Guid.NewGuid(), Name = "Laptopy", Code = "LAP", Description = "Komputery przenośne" },
            new() { Id = Guid.NewGuid(), Name = "Monitory", Code = "MON", Description = "Monitory i wyświetlacze" },
            new() { Id = Guid.NewGuid(), Name = "Telefony", Code = "TEL", Description = "Telefony komórkowe" },
            new() { Id = Guid.NewGuid(), Name = "Drukarki", Code = "DRU", Description = "Drukarki i urządzenia wielofunkcyjne" },
            new() { Id = Guid.NewGuid(), Name = "Inne", Code = "INN", Description = "Pozostałe urządzenia" }
        };

        await context.Categories.AddRangeAsync(categories);

        // Seed Locations
        var locations = new List<Location>
        {
            new() { Id = Guid.NewGuid(), Name = "Biuro główne", Address = "ul. Główna 1", Building = "A", Floor = "1", Room = "101" },
            new() { Id = Guid.NewGuid(), Name = "Magazyn", Address = "ul. Główna 1", Building = "B", Floor = "0", Room = "001" },
            new() { Id = Guid.NewGuid(), Name = "Serwerownia", Address = "ul. Główna 1", Building = "A", Floor = "-1", Room = "S01" }
        };

        await context.Locations.AddRangeAsync(locations);

        // Seed Admin User
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@assetmanagement.local",
            PasswordHash = passwordHasher.HashPassword("Admin123!"),
            FirstName = "System",
            LastName = "Administrator",
            Role = UserRole.Admin,
            Department = "IT",
            IsActive = true
        };

        await context.Users.AddAsync(adminUser);

        // Seed Sample Assets
        var assets = new List<Asset>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Dell Latitude 5520",
                SerialNumber = "DL5520-001",
                Description = "Laptop biznesowy",
                Manufacturer = "Dell",
                Model = "Latitude 5520",
                PurchasePrice = 4500.00m,
                PurchaseDate = DateTime.UtcNow.AddMonths(-6),
                WarrantyExpiration = DateTime.UtcNow.AddYears(2),
                Status = AssetStatus.Available,
                CategoryId = categories[0].Id,
                LocationId = locations[1].Id
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Dell Monitor P2722H",
                SerialNumber = "DM2722-001",
                Description = "Monitor 27 cali",
                Manufacturer = "Dell",
                Model = "P2722H",
                PurchasePrice = 1200.00m,
                PurchaseDate = DateTime.UtcNow.AddMonths(-3),
                WarrantyExpiration = DateTime.UtcNow.AddYears(3),
                Status = AssetStatus.Available,
                CategoryId = categories[1].Id,
                LocationId = locations[1].Id
            }
        };

        await context.Assets.AddRangeAsync(assets);

        await context.SaveChangesAsync();
    }
}
