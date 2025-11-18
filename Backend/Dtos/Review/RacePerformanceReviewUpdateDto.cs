namespace F1Journal.Dtos.Review;

public class RacePerformanceReviewUpdateDto
{
    public Guid RaceId { get; set; }
    public int Mark { get; set; }
    public string Description { get; set; }
}