using Lavanya_HMS.Application.Interfaces.Services;
using Lavanya_HMS.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Lavanya_HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] AddItemsDto item)
        {
            if (item == null)
                return BadRequest("Item cannot be null");

            var id = await _itemService.CreateItemAsync(item);
            return Ok(new { Id = id });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllItems()
        {
            var items = await _itemService.GetAllItemsAsync();
            return Ok(items);
        }

        [HttpPut("{id}/toggle")]
        public async Task<IActionResult> ToggleIsActive(int id)
        {
            var result = await _itemService.ToggleItemIsActiveAsync(id);
            if (!result) return NotFound();
            return Ok(new { Message = "Item status toggled successfully" });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] UpdateItemDto dto)
        {
            var result = await _itemService.UpdateItemDetailsAsync(id, dto.Name, dto.Price);
            if (!result) return NotFound();
            return Ok(new { Message = "Item updated successfully" });
        }

    }
}
