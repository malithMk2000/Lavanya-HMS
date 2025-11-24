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
        public async Task<IActionResult> CreateBooking([FromBody] AddBookingDto dto)
        {
            if (dto == null || dto.UserId <= 0)
                return BadRequest("Invalid booking data");

            var bookingId = await _bookingService.CreateBookingWithItemsAsync(dto);

            return Ok(new { BookingId = bookingId, Message = "Booking saved successfully" });
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBookingsByUserId(int userId)
        {
            var bookings = await _bookingService.GetBookingsByUserIdAsync(userId);
            return Ok(bookings);
        }

        [HttpGet("{bookingId}")]
        public async Task<IActionResult> GetBookingDetails(int bookingId)
        {
            var booking = await _bookingService.GetBookingDetailsAsync(bookingId);

            if (booking == null)
                return NotFound("Booking not found");

            return Ok(booking);
        }


    }
}
