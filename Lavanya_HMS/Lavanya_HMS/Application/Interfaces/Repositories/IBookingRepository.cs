using Lavanya_HMS.Application.DTOs;
using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Application.Interfaces.Repositories
{
    public interface IBookingRepository
    {
        Task<int> InsertAsync(Booking booking);
        Task<int> CreateBookingAsync(AddBookingDto dto);
        Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);
        Task<BookingDetailsDto> GetBookingDetailsAsync(int bookingId);
    }
}
