namespace F1Journal.Dtos.Review;

public class DriverPerformanceReviewUpdateDto
{
    public Guid DriverId { get; set; }
    public int Mark { get; set; }
    public string Description { get; set; }
}