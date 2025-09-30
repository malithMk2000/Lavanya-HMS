using Lavanya_HMS.Application.Interfaces.Services;
using Lavanya_HMS.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Lavanya_HMS.Core.Entity;

namespace Lavanya_HMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] AddBookingDto booking)
        {
            if (booking == null)
                return BadRequest("Booking cannot be null");

            var id = await _bookingService.CreateBookingAsync(booking);
            return Ok(new { Id = id });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBookingsByUserId(int userId)
        {
            var bookings = await _bookingService.GetBookingsByUserIdAsync(userId);
            return Ok(bookings);
        }


    }
}
