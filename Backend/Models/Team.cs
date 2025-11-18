namespace F1Journal.Models;

public class Team
{
    public Guid Id { get; set; }
    public string Name  { get; set; }
    public string Base  { get; set; }
    public string TeamPrincipal { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid SeasonId { get; set; }
    public Season Season { get; set; }

    public ICollection<Driver> Drivers { get; set; } = new List<Driver>();
}