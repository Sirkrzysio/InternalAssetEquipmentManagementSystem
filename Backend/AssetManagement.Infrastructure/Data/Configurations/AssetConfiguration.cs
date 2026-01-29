using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AssetManagement.Infrastructure.Data.Configurations;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(a => a.SerialNumber)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(a => a.SerialNumber)
            .IsUnique();

        builder.Property(a => a.Description)
            .HasMaxLength(1000);

        builder.Property(a => a.Manufacturer)
            .HasMaxLength(100);

        builder.Property(a => a.Model)
            .HasMaxLength(100);

        builder.Property(a => a.PurchasePrice)
            .HasPrecision(18, 2);

        builder.Property(a => a.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasOne(a => a.Category)
            .WithMany(c => c.Assets)
            .HasForeignKey(a => a.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(a => a.Location)
            .WithMany(l => l.Assets)
            .HasForeignKey(a => a.LocationId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
