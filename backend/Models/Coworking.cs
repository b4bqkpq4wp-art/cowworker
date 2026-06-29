namespace backend.Models;

public class Coworking
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string District { get; set; } = string.Empty;

    public string Metro { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal PricePerHour { get; set; }

    public double Rating { get; set; }

    public string NoiseLevel { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public List<string> Amenities { get; set; } = [];
}