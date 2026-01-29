using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.Assets;

public class AssetDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Manufacturer { get; set; }
    public string? Model { get; set; }
    public decimal PurchasePrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public DateTime? WarrantyExpiration { get; set; }

    public AssetStatus Status { get; set; }
    public string StatusName => Status.ToString();

    public Guid CategoryId { get; set; }
    public string? CategoryName { get; set; }

    public Guid? LocationId { get; set; }
    public string? LocationName { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
