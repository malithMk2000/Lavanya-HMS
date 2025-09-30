using Lavanya_HMS.Application.DTOs;
using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Application.Interfaces.Services
{
    public interface IBookingService
    {
        Task<int> CreateBookingAsync(AddBookingDto booking);
        Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId);

    }
}
