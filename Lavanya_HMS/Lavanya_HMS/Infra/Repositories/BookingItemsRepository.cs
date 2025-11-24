using Lavanya_HMS.Application.DTOs;
using Lavanya_HMS.Application.Interfaces.Repositories;
using Dapper;
using Npgsql;

namespace Lavanya_HMS.Infra.Repositories
{
    public class BookingItemsRepository : IBookingItemsRepository
    {
        private readonly IConfiguration _config;
        public BookingItemsRepository(IConfiguration config) => _config = config;
        private NpgsqlConnection CreateConnection() => new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));

        public async Task AddBookingItemsAsync(int bookingId, List<BookingItemDto> items)
        {
            using var conn = CreateConnection();
            var sql = @"INSERT INTO BookingItems (BookingId, ItemId, Quantity)
                    VALUES (@BookingId, @ItemId, @Quantity)";
            foreach (var item in items)
            {
                await conn.ExecuteAsync(sql, new { BookingId = bookingId, item.ItemId, item.Quantity });
            }
        }
    }
}
