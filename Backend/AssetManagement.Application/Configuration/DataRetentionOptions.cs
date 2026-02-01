namespace AssetManagement.Application.Configuration;

public class DataRetentionOptions
{
    public const string SectionName = "DataRetention";
    
    public int CategoriesRetentionHours { get; set; } = 24;
    public int LocationsRetentionHours { get; set; } = 24; 
    public int UsersRetentionDays { get; set; } = 30;
    public int AssetsRetentionDays { get; set; } = 90;
    public bool NotificationEnabled { get; set; } = true;
    public int NotificationHoursBeforeDeletion { get; set; } = 1;
}
