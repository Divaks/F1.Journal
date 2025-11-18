using F1Journal.Dtos.Team;

namespace F1Journal.Models;

public class Season
{
    public Guid Id { get; set; }
    public int Year { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public ICollection<Team> Teams { get; set; }
    public ICollection<Race> Races { get; set; } = new List<Race>();
}