using AssetManagement.Domain.Entities;
using AssetManagement.Domain.Entities.Common;
using Microsoft.EntityFrameworkCore;

namespace AssetManagement.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Zmieniam nazwy tabel żeby pasowały do Twojej bazy danych
    public DbSet<User> Users => Set<User>();
    public DbSet<Asset> Assets => Set<Asset>(); // Assets w kodzie, equipment w bazie
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // ===== users =====
        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("users");
            e.HasKey(x => x.Id);
            
            e.Property(x => x.Username).HasMaxLength(50).IsRequired();
            e.Property(x => x.Email).HasMaxLength(100).IsRequired();
            e.Property(x => x.PasswordHash).HasMaxLength(255).IsRequired();
            e.Property(x => x.FirstName).HasMaxLength(50);
            e.Property(x => x.LastName).HasMaxLength(50);
            e.Property(x => x.Role).HasConversion<string>().HasMaxLength(20);
            
            e.HasIndex(x => x.Username).IsUnique();
            e.HasIndex(x => x.Email).IsUnique();
        });

        // ===== equipment (Asset w kodzie, equipment w bazie) =====
        modelBuilder.Entity<Asset>(e =>
        {
            e.ToTable("equipment");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.SerialNumber).HasMaxLength(50);
            e.Property(x => x.Status).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.Manufacturer).HasMaxLength(100);
            e.Property(x => x.Model).HasMaxLength(100);
            e.Property(x => x.CategoryId).HasColumnName("category_id");

            e.HasIndex(x => x.SerialNumber).IsUnique();
            e.HasIndex(x => x.Status).HasDatabaseName("idx_equipment_status");

            e.HasOne(x => x.Category)
                .WithMany(c => c.Assets)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.Location)
                .WithMany(l => l.Assets)
                .HasForeignKey(x => x.LocationId)
                .OnDelete(DeleteBehavior.SetNull);

            // soft delete
            e.HasQueryFilter(x => x.DeletedAt == null);
        });

        // ===== locations =====
        modelBuilder.Entity<Location>(e =>
        {
            e.ToTable("locations");
            e.HasKey(x => x.Id);

            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Description).HasMaxLength(255);
        });

        // ===== categories =====
        modelBuilder.Entity<Category>(e =>
        {
            e.ToTable("categories");
            e.HasKey(x => x.Id);
            
            e.Property(x => x.Name).HasMaxLength(50).IsRequired();
            e.Property(x => x.Description).HasMaxLength(255);
            
            e.HasIndex(x => x.Name).IsUnique();
        });

        // ===== assignments =====
        modelBuilder.Entity<Assignment>(e =>
        {
            e.ToTable("assignments");
            e.HasKey(x => x.Id);
            
            e.Property(x => x.Type).HasConversion<string>();
            e.Property(x => x.Notes).HasMaxLength(500);

            e.HasIndex(x => x.AssetId)
                .HasDatabaseName("idx_assignments_equipment");

            e.HasOne(x => x.Asset)
                .WithMany(a => a.Assignments)
                .HasForeignKey(x => x.AssetId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(x => x.User)
                .WithMany(u => u.Assignments)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
                
            e.HasOne(x => x.Location)
                .WithMany()
                .HasForeignKey(x => x.LocationId)
                .OnDelete(DeleteBehavior.SetNull);
                
            // Query filter - filtruj usunięte Assets
            e.HasQueryFilter(x => x.Asset == null || x.Asset.DeletedAt == null);
        });

        // ===== audit_logs =====
        modelBuilder.Entity<AuditLog>(e =>
        {
            e.ToTable("audit_logs");
            e.HasKey(x => x.Id);

            e.Property(x => x.Action).HasConversion<string>().HasMaxLength(50);
            e.Property(x => x.EntityName).HasMaxLength(50);
            e.Property(x => x.UserName).HasMaxLength(100);
            e.Property(x => x.IpAddress).HasMaxLength(45);

            e.HasIndex(x => x.UserId).HasDatabaseName("idx_audit_logs_user");
            e.HasIndex(x => x.Timestamp).HasDatabaseName("idx_audit_logs_created_at");
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<Domain.Entities.Common.BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
