using System.Text.Json.Serialization;

namespace F1Journal.Dtos.User;

public class UserForCreationDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; }
    
    [JsonPropertyName("email")]
    public string Email { get; set; }
    
    [JsonPropertyName("password")]
    public string Password { get; set; }
}