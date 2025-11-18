using F1Journal.Dtos.User;

namespace F1Journal.Dtos.Review;

public class DriverPerformanceReviewResponseDto
{
    public Guid Id { get; set; }
    public int Mark { get; set; }
    public string Description { get; set; }
    public Guid DriverId { get; set; }
    public string DriverName { get; set; }
    public Guid RaceId { get; set; }
    
    public UserResponseDto Author { get; set; }
}