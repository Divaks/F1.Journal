namespace F1Journal.Models;

public class RaceResult
{
    public Guid Id { get; set; }
    public int StartingPosition { get; set; }
    public int FinishingPosition { get; set; }
    public int Points { get; set; }
    
    public Guid RaceId { get; set; }
    public Race Race { get; set; }
    
    public Guid DriverId { get; set; }
    public Driver Driver { get; set; }
}