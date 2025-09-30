using Dapper;
using Lavanya_HMS.Application.Interfaces.Repositories;
using Lavanya_HMS.Core.Entity;
using Npgsql;

namespace Lavanya_HMS.Infra.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly IConfiguration _config;

        public BookingRepository(IConfiguration config)
        {
            _config = config;
        }

        private NpgsqlConnection CreateConnection()
        {
            return new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        }

        public async Task<int> InsertAsync(Booking booking)
        {
            using var connection = CreateConnection();
            var sql = @"INSERT INTO booking 
                        (userid, isfullpaid, totalpayment, advancedpayment, deductionamount, securitydeposit, returnablesecuritydeposit, createdat)
                        VALUES 
                        (@UserId, @IsFullPaid, @TotalPayment, @AdvancedPayment, @DeductionAmount, @SecurityDeposit, @ReturnableSecurityDeposit, @CreatedAt)
                        RETURNING id";
            return await connection.ExecuteScalarAsync<int>(sql, booking);
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = "SELECT * FROM booking WHERE userid = @UserId";
            return await connection.QueryAsync<Booking>(sql, new { UserId = userId });
        }


    }
}
