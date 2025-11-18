namespace F1Journal.Models;

public class Race
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string CircuitName { get; set; }
    public DateTime RaceDate { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public Guid SeasonId { get; set; }
    public Season Season { get; set; }
    
    public ICollection<RaceResult> Results { get; set; } = new List<RaceResult>();
}