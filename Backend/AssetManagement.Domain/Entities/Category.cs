using AssetManagement.Domain.Entities.Common;

namespace AssetManagement.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Code { get; set; }

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}
