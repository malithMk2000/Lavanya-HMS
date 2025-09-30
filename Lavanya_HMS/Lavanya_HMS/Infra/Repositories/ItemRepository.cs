using Dapper;
using Lavanya_HMS.Application.Interfaces.Repositories;
using Lavanya_HMS.Core.Entity;
using Npgsql;

namespace Lavanya_HMS.Infra.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly IConfiguration _config;

        public ItemRepository(IConfiguration config)
        {
            _config = config;
        }

        private NpgsqlConnection CreateConnection()
        {
            return new NpgsqlConnection(_config.GetConnectionString("DefaultConnection"));
        }

        public async Task<int> InsertAsync(Items item)
        {
            using var connection = CreateConnection();
            var sql = @"INSERT INTO items (name, price, isactive, createdat) 
                        VALUES (@Name, @Price, @IsActive, @CreatedAt) RETURNING id";
            return await connection.ExecuteScalarAsync<int>(sql, item);
        }

        public async Task<IEnumerable<Items>> GetAllAsync()
        {
            using var connection = CreateConnection();
            var sql = "SELECT * FROM items WHERE isactive = true ORDER BY createdat DESC";
            return await connection.QueryAsync<Items>(sql);
        }

        public async Task<int> ToggleIsActiveAsync(int id)
        {
            using var connection = CreateConnection();
            var sql = @"UPDATE items 
                SET isactive = NOT isactive 
                WHERE id = @Id";
            return await connection.ExecuteAsync(sql, new { Id = id });
        }

        public async Task<int> UpdateItemAsync(Items item)
        {
            using var connection = CreateConnection();
            var sql = @"UPDATE items 
                SET name = @Name, price = @Price 
                WHERE id = @Id";
            return await connection.ExecuteAsync(sql, item);
        }

    }
}
