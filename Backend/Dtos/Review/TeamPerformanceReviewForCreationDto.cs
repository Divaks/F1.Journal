using System.Text.Json.Serialization;

namespace F1Journal.Dtos.Review;

public class TeamPerformanceReviewForCreationDto
{
    [JsonPropertyName("mark")]
    public int Mark { get; set; }
    
    [JsonPropertyName("description")]
    public string Description { get; set; }
    
    [JsonPropertyName("teamId")]
    public Guid TeamId { get; set; }
    
    [JsonPropertyName("raceId")]
    public Guid RaceId { get; set; }
}