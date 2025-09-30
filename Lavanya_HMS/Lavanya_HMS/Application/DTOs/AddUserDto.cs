namespace Lavanya_HMS.Application.DTOs
{
    public class AddUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Address { get; set; } // Optional
        public string? PhoneNo { get; set; } // Optional
        public string? NIC { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}
