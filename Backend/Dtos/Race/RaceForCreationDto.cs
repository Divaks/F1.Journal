using System.Text.Json.Serialization;

namespace F1Journal.Dtos.Race;

public class RaceForCreationDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("circuitName")]
    public string CircuitName { get; set; }
    
    [JsonPropertyName("raceDate")]
    public DateTime RaceDate { get; set; }
}