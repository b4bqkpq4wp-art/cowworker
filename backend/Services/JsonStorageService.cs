using System.Text.Json;
using backend.Models;

namespace backend.Services;

public class JsonStorageService
{
    private readonly string _coworkingsPath;
    private readonly string _bookingsPath;

    private readonly JsonSerializerOptions _options = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true
    };

    public JsonStorageService()
    {
        _coworkingsPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Data",
            "coworkings.json");

        _bookingsPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Data",
            "bookings.json");
    }

    public List<Coworking> GetCoworkings()
    {
        var json = File.ReadAllText(_coworkingsPath);

        return JsonSerializer.Deserialize<List<Coworking>>(json, _options)
               ?? new List<Coworking>();
    }

    public List<Booking> GetBookings()
    {
        var json = File.ReadAllText(_bookingsPath);

        return JsonSerializer.Deserialize<List<Booking>>(json, _options)
               ?? new List<Booking>();
    }

    public Booking AddBooking(Booking booking)
    {
        var bookings = GetBookings();
        var coworkings = GetCoworkings();

        var coworking = coworkings.FirstOrDefault(c => c.Id == booking.CoworkingId);

        if (coworking is null)
        {
            throw new InvalidOperationException("Коворкинг не найден.");
        }

        booking.Id = bookings.Count == 0
            ? 1
            : bookings.Max(b => b.Id) + 1;

        booking.TotalPrice = coworking.PricePerHour * booking.Hours;
        booking.Status = "Подтверждено";
        booking.CreatedAt = DateTime.Now;

        bookings.Add(booking);

        var json = JsonSerializer.Serialize(bookings, _options);
        File.WriteAllText(_bookingsPath, json);

        return booking;
    }
}