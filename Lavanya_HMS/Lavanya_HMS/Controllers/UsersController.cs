using Microsoft.AspNetCore.Mvc;
using Lavanya_HMS.Application.Interfaces.Services;
using Lavanya_HMS.Application.DTOs;
using Lavanya_HMS.Application.Services;

namespace Lavanya_HMS.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService IUserService)
        {
            _userService = IUserService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] AddUserDto user)
        {
            if (user == null)
                return BadRequest("User cannot be null");

            var id = await _userService.CreateUserAsync(user);
            return Ok(new { Id = id });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var items = await _userService.GetAllUsersAsync();
            return Ok(items);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            if (dto == null)
                return BadRequest("User cannot be null");

            dto.Id = id;

            var result = await _userService.UpdateUserAsync(dto);
            if (!result)
                return NotFound("User not found");

            return Ok("User updated successfully");
        }



    }
}
