namespace AssetManagement.Application.DTOs.Locations;

public class CreateLocationDto
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Building { get; set; }
    public string? Floor { get; set; }
    public string? Room { get; set; }
    public string? Description { get; set; }
}
