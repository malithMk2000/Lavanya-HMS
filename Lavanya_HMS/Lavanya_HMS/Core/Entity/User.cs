namespace Lavanya_HMS.Core.Entity
{
    public class User
    {
        public int Id { get; set; }          // Primary key
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Address { get; set; } // Optional
        public string? PhoneNo { get; set; } // Optional
        public string? NIC { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
