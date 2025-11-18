using System.Text.Json.Serialization;

namespace F1Journal.Dtos.Team;

public class TeamForCreationDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("base")]
    public string Base { get; set; }

    [JsonPropertyName("teamPrincipal")]
    public string TeamPrincipal { get; set; }
}