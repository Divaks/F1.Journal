using System.Text.Json.Serialization;

namespace F1Journal.Dtos.Review;

public class RaceReviewForCreationDto
{
    [JsonPropertyName("mark")]
    public int Mark { get; set; }
    
    [JsonPropertyName("description")]
    public string Description { get; set; }
    
    [JsonPropertyName("raceId")]
    public Guid RaceId { get; set; }
}