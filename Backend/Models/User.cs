namespace F1Journal.Models;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    
    public string PasswordHash { get; set; }
    
    public ICollection<RaceReview> RaceReviews { get; set; } = new List<RaceReview>();
    public ICollection<DriverPerformanceReview> DriverReviews { get; set; } = new List<DriverPerformanceReview>();
    public ICollection<TeamPerformanceReview> TeamReviews { get; set; } = new List<TeamPerformanceReview>();
}