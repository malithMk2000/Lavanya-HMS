using Lavanya_HMS.Application.DTOs;
using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Application.Interfaces.Services
{
    public interface IBookingService
    {
        Task<int> CreateBookingAsync(AddBookingDto booking);
        Task<int> CreateBookingWithItemsAsync(AddBookingDto dto);
        Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId);
        Task<BookingDetailsDto> GetBookingDetailsAsync(int bookingId);

    }
}
