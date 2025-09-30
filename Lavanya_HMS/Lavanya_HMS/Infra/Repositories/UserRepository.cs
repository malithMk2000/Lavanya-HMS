using Dapper;
using Npgsql;
using Lavanya_HMS.Core.Entity;
using Lavanya_HMS.Application.Interfaces.Repositories;

namespace Lavanya_HMS.Infra.Repositories
{
    public class UserRepository : IUserRepository
    {

        private readonly IConfiguration _config;

        public UserRepository(IConfiguration config)
        {
            _config = config;
        }

        private NpgsqlConnection CreateConnection()
        {
            return new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        }

        public async Task<int> InsertAsync(User user)
        {
            using var connection = CreateConnection();
            var sql = @"INSERT INTO users (firstname, lastname, address, phoneno, email, isactive, createdat, nic)
                        VALUES (@FirstName, @LastName, @Address, @PhoneNo, @Email, @IsActive, @CreatedAt, @NIC)
                        RETURNING id";
            return await connection.ExecuteScalarAsync<int>(sql, user);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            using var connection = CreateConnection();
            var sql = "SELECT * FROM users WHERE isactive = true ORDER BY createdat DESC";
            return await connection.QueryAsync<User>(sql);
        }
    }
}
