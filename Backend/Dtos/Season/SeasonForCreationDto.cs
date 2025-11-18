using System.Text.Json.Serialization;

namespace F1Journal.Dtos.Season;

public class SeasonForCreationDto
{
    [JsonPropertyName("year")]
    public int Year { get; set; }
}