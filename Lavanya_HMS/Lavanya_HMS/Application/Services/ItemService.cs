using Lavanya_HMS.Application.Interfaces.Repositories;
using Lavanya_HMS.Application.Interfaces.Services;
using Lavanya_HMS.Core.Entity;
using Lavanya_HMS.Application.DTOs;

namespace Lavanya_HMS.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;

        public ItemService(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        public async Task<int> CreateItemAsync(AddItemsDto Item)
        {
            var item = new Items
            {
                Name = Item.Name,
                Price = Item.Price,
                IsActive = true,               
                CreatedAt = DateTime.Now       
            };

            return await _itemRepository.InsertAsync(item);
        }

        public async Task<IEnumerable<Items>> GetAllItemsAsync()
        {
            return await _itemRepository.GetAllAsync();
        }

        public async Task<bool> ToggleItemIsActiveAsync(int id)
        {
            var rows = await _itemRepository.ToggleIsActiveAsync(id);
            return rows > 0;
        }

        public async Task<bool> UpdateItemDetailsAsync(int id, string name, decimal price)
        {
            var item = new Items
            {
                Id = id,
                Name = name,
                Price = price
            };
            var rows = await _itemRepository.UpdateItemAsync(item);
            return rows > 0;
        }

    }
}
