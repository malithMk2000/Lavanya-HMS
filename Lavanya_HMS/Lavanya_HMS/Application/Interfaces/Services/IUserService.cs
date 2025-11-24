using Lavanya_HMS.Core.Entity;
using Lavanya_HMS.Application.DTOs;

namespace Lavanya_HMS.Application.Interfaces.Services
{
    public interface IUserService
    {
        Task<int> CreateUserAsync(AddUserDto user);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<bool> UpdateUserAsync(UpdateUserDto user);
        Task<User?> GetByIdAsync(int id);

    }
}
