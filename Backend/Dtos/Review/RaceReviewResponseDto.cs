namespace F1Journal.Dtos.Review; 

using F1Journal.Dtos.User; 

public class RaceReviewResponseDto
{
    public Guid Id { get; set; }
    public int Mark { get; set; }
    public string Description { get; set; }
    public string RaceName { get; set; }
    
    public Guid RaceId { get; set; }
    public UserResponseDto Author { get; set; }
}