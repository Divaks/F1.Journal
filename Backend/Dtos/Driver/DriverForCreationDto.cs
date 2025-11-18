using System.Text.Json.Serialization;

namespace F1Journal.Dtos.Driver;

public class DriverForCreationDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("nationality")]
    public string Nationality { get; set; }

    [JsonPropertyName("driverNumber")]
    public int DriverNumber { get; set; }
    
    [JsonPropertyName("teamId")]
    public Guid TeamId { get; set; }
}