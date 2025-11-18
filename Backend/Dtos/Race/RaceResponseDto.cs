namespace F1Journal.Dtos.Race;

public class RaceResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string CircuitName { get; set; }
    public DateTime RaceDate { get; set; }
    public Guid SeasonId { get; set; }
}