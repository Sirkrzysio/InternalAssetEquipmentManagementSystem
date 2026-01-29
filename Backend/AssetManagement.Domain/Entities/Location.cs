using AssetManagement.Domain.Entities.Common;

namespace AssetManagement.Domain.Entities;

public class Location : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Building { get; set; }
    public string? Floor { get; set; }
    public string? Room { get; set; }
    public string? Description { get; set; }
    
    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
