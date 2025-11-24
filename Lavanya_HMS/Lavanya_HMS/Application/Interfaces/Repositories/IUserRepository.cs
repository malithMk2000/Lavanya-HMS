using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<int> InsertAsync(User user);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(User user);

    }
}
