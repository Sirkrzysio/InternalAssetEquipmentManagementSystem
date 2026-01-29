using AssetManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AssetManagement.Infrastructure.Data.Configurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(l => l.Address)
            .HasMaxLength(500);

        builder.Property(l => l.Building)
            .HasMaxLength(100);

        builder.Property(l => l.Floor)
            .HasMaxLength(50);

        builder.Property(l => l.Room)
            .HasMaxLength(50);

        builder.Property(l => l.Description)
            .HasMaxLength(1000);
    }
}
