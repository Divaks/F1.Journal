using F1Journal.Dtos.Review;

namespace F1Journal.Dtos;

public class DashboardResponseDto
{
    public List<RaceReviewResponseDto> RaceReviews { get; set; } = new();
    public List<DriverPerformanceReviewResponseDto> DriverPerformanceReviews { get; set; } = new();
    public List<TeamPerformanceReviewResponseDto> TeamPerformanceReviews { get; set; } = new();
}