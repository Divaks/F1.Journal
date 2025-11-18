using F1Journal.Dtos.User;

namespace F1Journal.Dtos.Review;

public class TeamPerformanceReviewResponseDto
{
    public Guid Id { get; set; }
    public int Mark { get; set; }
    public string Description { get; set; }
    public Guid TeamId { get; set; }
    public Guid RaceId { get; set; }
    public string TeamName { get; set; }
    
    public UserResponseDto Author { get; set; }
}