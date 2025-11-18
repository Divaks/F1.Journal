using F1Journal.Dtos.Driver;

namespace F1Journal.Dtos.Team;

public class TeamResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Base { get; set; }
    public string TeamPrincipal { get; set; }

    public List<DriverResponseDto> Drivers { get; set; } = new();
}