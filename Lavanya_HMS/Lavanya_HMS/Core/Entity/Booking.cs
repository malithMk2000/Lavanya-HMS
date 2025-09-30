namespace Lavanya_HMS.Core.Entity
{
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool IsFullPaid { get; set; } = false;
        public decimal TotalPayment { get; set; }
        public decimal AdvancedPayment { get; set; } = 0;
        public decimal RemainingPayment { get; set; } = 0; // Optional, can be calculated
        public decimal DeductionAmount { get; set; } = 0;
        public decimal SecurityDeposit { get; set; } = 0;
        public decimal ReturnableSecurityDeposit { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
