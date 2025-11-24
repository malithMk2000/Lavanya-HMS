namespace Lavanya_HMS.Application.DTOs
{
    public class BookingDetailsDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public bool IsFullPaid { get; set; }
        public decimal TotalPayment { get; set; }
        public decimal AdvancedPayment { get; set; }
        public decimal DeductionAmount { get; set; }
        public decimal SecurityDeposit { get; set; }
        public decimal RemainingPayment { get; set; }
        public List<BookingItemDetailDto> Items { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class BookingItemDetailDto
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Subtotal { get; set; }
    }
}
