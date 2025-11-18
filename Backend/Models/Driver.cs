namespace F1Journal.Models;

public class Driver
{
    public Guid Id { get; set; }
    public string Name  { get; set; }
    public string Nationality  { get; set; }
    public int DriverNumber  { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid TeamId  { get; set; }
    public Team Team  { get; set; }
}