using F1Journal.Dtos.Driver;
using F1Journal.Dtos.Race;
using F1Journal.Dtos.Team;

namespace F1Journal.Dtos.Season;

public class SeasonResponseDto
{
    public Guid Id { get; set; }
    public int Year { get; set; }

    public List<TeamResponseDto> Teams { get; set; }
    public List<RaceResponseDto> Races { get; set; } = new();
}