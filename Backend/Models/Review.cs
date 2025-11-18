using System.ComponentModel.DataAnnotations;

namespace F1Journal.Models;

public abstract class Review
{
    public Guid Id { get; set; }
    
    [Range(1, 10)]
    public int Mark { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    public Guid UserId { get; set; }
    public User User { get; set; }
    
    public Guid RaceId { get; set; }
    public Race Race { get; set; }
}