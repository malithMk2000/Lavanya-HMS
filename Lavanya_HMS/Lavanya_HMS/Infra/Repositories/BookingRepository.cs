using Dapper;
using Lavanya_HMS.Application.DTOs;
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

        public async Task<int> CreateBookingAsync(AddBookingDto dto)
        {
            using var conn = CreateConnection();
            var sql = @"INSERT INTO Booking (UserId, IsFullPaid, TotalPayment, AdvancedPayment, DeductionAmount, SecurityDeposit, CreatedAt)
            VALUES (@UserId, @IsFullPaid, @TotalPayment, @AdvancedPayment, @DeductionAmount, @SecurityDeposit, NOW())
            RETURNING Id";

            return await conn.ExecuteScalarAsync<int>(sql, new
            {
                UserId = dto.UserId,
                IsFullPaid = dto.IsFullPaid,
                TotalPayment = dto.TotalPayment,
                AdvancedPayment = dto.AdvancedPayment,
                DeductionAmount = dto.DeductionAmount,
                SecurityDeposit = dto.SecurityDeposit
            });
        }

        public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = "SELECT * FROM booking WHERE userid = @UserId";
            return await connection.QueryAsync<Booking>(sql, new { UserId = userId });
        }

        public async Task<BookingDetailsDto> GetBookingDetailsAsync(int bookingId)
        {
            using var conn = CreateConnection();

            var sql = @"
        SELECT 
            b.id,
            b.userid,
            b.isfullpaid,
            b.totalpayment,
            b.advancedpayment,
            b.deductionamount,
            b.securitydeposit,
            b.remainingpayment,
            b.createdat,
            u.firstname || ' ' || u.lastname as customername,
            u.phoneno as phonenumber,
            u.address
        FROM booking b
        INNER JOIN users u ON b.userid = u.id
        WHERE b.id = @BookingId";

            var booking = await conn.QueryFirstOrDefaultAsync<BookingDetailsDto>(sql, new { BookingId = bookingId });

            if (booking == null)
                return null;

            // Get booking items
            var itemsSql = @"
        SELECT 
            bi.itemid,
            i.name as itemname,
            bi.quantity,
            i.price,
            (bi.quantity * i.price) as subtotal
        FROM bookingitems bi
        INNER JOIN items i ON bi.itemid = i.id
        WHERE bi.bookingid = @BookingId";

            booking.Items = (await conn.QueryAsync<BookingItemDetailDto>(itemsSql, new { BookingId = bookingId })).ToList();

            return booking;
        }


    }
}
