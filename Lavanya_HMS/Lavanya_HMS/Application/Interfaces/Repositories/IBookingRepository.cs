using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Application.Interfaces.Repositories
{
    public interface IBookingRepository
    {
        Task<int> InsertAsync(Booking booking);
        Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);
    }
}
