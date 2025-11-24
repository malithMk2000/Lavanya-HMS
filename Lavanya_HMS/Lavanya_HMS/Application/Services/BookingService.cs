using Lavanya_HMS.Application.Interfaces.Repositories;
using Lavanya_HMS.Application.Interfaces.Services;
using Lavanya_HMS.Core.Entity;
using Lavanya_HMS.Application.DTOs;

namespace Lavanya_HMS.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IBookingItemsRepository _itemsRepo;

        public BookingService(
        IBookingRepository bookingRepository,
        IBookingItemsRepository itemsRepo)
        {
            _bookingRepository = bookingRepository;
            _itemsRepo = itemsRepo;
        }

        public async Task<int> CreateBookingAsync(AddBookingDto booking)
        {
            var Booking = new Booking
            {
                UserId = booking.UserId,
                IsFullPaid = booking.IsFullPaid,
                TotalPayment = booking.TotalPayment,
                AdvancedPayment = booking.AdvancedPayment,
                RemainingPayment = booking.TotalPayment - booking.AdvancedPayment,
                DeductionAmount = booking.DeductionAmount,
                SecurityDeposit = booking.SecurityDeposit,
                ReturnableSecurityDeposit = booking.SecurityDeposit - booking.DeductionAmount,
                CreatedAt = DateTime.Now
            };

            return await _bookingRepository.InsertAsync(Booking);
        }

        public async Task<int> CreateBookingWithItemsAsync(AddBookingDto dto)
        {
            // 1️⃣ Create Booking
            var bookingId = await _bookingRepository.CreateBookingAsync(dto);

            // 2️⃣ Add Items
            if (dto.Items.Any())
                await _itemsRepo.AddBookingItemsAsync(bookingId, dto.Items);

            return bookingId;
        }

        public async Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId)
        {
            return await _bookingRepository.GetByUserIdAsync(userId);
        }

        public async Task<BookingDetailsDto> GetBookingDetailsAsync(int bookingId)
        {
            return await _bookingRepository.GetBookingDetailsAsync(bookingId);
        }

    }
}
