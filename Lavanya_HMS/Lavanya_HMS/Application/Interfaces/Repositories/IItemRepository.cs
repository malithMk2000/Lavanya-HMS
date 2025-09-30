using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Application.Interfaces.Repositories
{
    public interface IItemRepository
    {
        Task<int> InsertAsync(Items item);
        Task<IEnumerable<Items>> GetAllAsync();
        Task<int> ToggleIsActiveAsync(int id);
        Task<int> UpdateItemAsync(Items item);
    }
}
