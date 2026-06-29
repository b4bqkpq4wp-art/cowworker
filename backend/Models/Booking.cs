namespace backend.Models;

public class Booking
{
    public int Id { get; set; }

    public int CoworkingId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Date { get; set; } = string.Empty;

    public string StartTime { get; set; } = string.Empty;

    public int Hours { get; set; }

    public string Comment { get; set; } = string.Empty;

    public decimal TotalPrice { get; set; }

    public string Status { get; set; } = "Подтверждено";

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}