namespace F1Journal.Models;

public class TeamPerformanceReview : Review
{
    public Guid TeamId { get; set; }
    public Team Team { get; set; }
}