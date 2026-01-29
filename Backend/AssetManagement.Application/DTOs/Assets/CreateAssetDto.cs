using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.Assets;

public class CreateAssetDto
{
    public string Name { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Manufacturer { get; set; }
    public string? Model { get; set; }
    public decimal PurchasePrice { get; set; }
    public DateTime PurchaseDate { get; set; }
    public DateTime? WarrantyExpiration { get; set; }
    public AssetStatus Status { get; set; } = AssetStatus.Available;
    public Guid CategoryId { get; set; }
    public Guid? LocationId { get; set; }
}
