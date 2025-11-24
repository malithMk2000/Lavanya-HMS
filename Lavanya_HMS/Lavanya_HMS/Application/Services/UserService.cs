using Lavanya_HMS.Application.Interfaces.Repositories;
using Lavanya_HMS.Application.Interfaces.Services;
using Lavanya_HMS.Core.Entity;
using Lavanya_HMS.Application.DTOs;
using Lavanya_HMS.Infra.Repositories;

namespace Lavanya_HMS.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<int> CreateUserAsync(AddUserDto user)
        {
            var User = new User
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Address = user.Address,
                PhoneNo = user.PhoneNo,
                Email = user.Email,
                NIC = user.NIC,
                IsActive = true,
                CreatedAt = DateTime.Now
            };
            return await _userRepository.InsertAsync(User);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<bool> UpdateUserAsync(UpdateUserDto user)
        {
            var existingUser = await _userRepository.GetByIdAsync(user.Id);
            if (existingUser == null)
                return false;

            existingUser.FirstName = user.FirstName;
            existingUser.LastName = user.LastName;
            existingUser.Address = user.Address;
            existingUser.PhoneNo = user.PhoneNo;
            existingUser.Email = user.Email;
            existingUser.NIC = user.NIC;
            existingUser.IsActive = user.IsActive;

            return await _userRepository.UpdateAsync(existingUser);
        }
    }
}
