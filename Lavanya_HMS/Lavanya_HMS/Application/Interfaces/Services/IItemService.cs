using Lavanya_HMS.Application.DTOs;
using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Application.Interfaces.Services
{
    public interface IItemService
    {
        Task<int> CreateItemAsync(AddItemsDto item);
        Task<IEnumerable<Items>> GetAllItemsAsync();
        Task<bool> ToggleItemIsActiveAsync(int id);
        Task<bool> UpdateItemDetailsAsync(int id, string name, decimal price);
    }
}
