namespace F1Journal.Models;

public class DriverPerformanceReview : Review
{
    public Guid DriverId { get; set; }
    public Driver Driver { get; set; }
}