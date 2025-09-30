namespace Lavanya_HMS.Application.DTOs
{
    public class AddBookingDto
    {
        public int UserId { get; set; }
        public bool IsFullPaid { get; set; } = false;
        public decimal TotalPayment { get; set; }
        public decimal AdvancedPayment { get; set; } = 0;
        public decimal DeductionAmount { get; set; } = 0;
        public decimal SecurityDeposit { get; set; } = 0;
    }
}
