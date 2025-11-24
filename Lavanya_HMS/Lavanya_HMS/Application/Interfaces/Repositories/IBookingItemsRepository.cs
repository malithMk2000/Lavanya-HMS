using Lavanya_HMS.Application.DTOs;

namespace Lavanya_HMS.Application.Interfaces.Repositories
{
    public interface IBookingItemsRepository
    {
        Task AddBookingItemsAsync(int bookingId, List<BookingItemDto> items);
    }
}
