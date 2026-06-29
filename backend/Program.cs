using backend.Models;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<JsonStorageService>();

var app = builder.Build();

app.UseCors("AllowFrontend");

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", () =>
{
    return Results.Ok(new
    {
        project = "Cowworker",
        description = "API веб-сервиса поиска и бронирования коворкингов",
        swagger = "/swagger"
    });
});

app.MapGet("/api/coworkings", (JsonStorageService storage) =>
{
    return Results.Ok(storage.GetCoworkings());
});

app.MapGet("/api/coworkings/{id:int}", (int id, JsonStorageService storage) =>
{
    var coworking = storage.GetCoworkings().FirstOrDefault(c => c.Id == id);

    return coworking is null
        ? Results.NotFound(new { message = "Коворкинг не найден" })
        : Results.Ok(coworking);
});

app.MapGet("/api/bookings", (JsonStorageService storage) =>
{
    return Results.Ok(storage.GetBookings());
});

app.MapPost("/api/bookings", (Booking booking, JsonStorageService storage) =>
{
    if (booking.CoworkingId <= 0)
        return Results.BadRequest(new { message = "Необходимо указать коворкинг." });

    if (string.IsNullOrWhiteSpace(booking.CustomerName))
        return Results.BadRequest(new { message = "Необходимо указать имя пользователя." });

    if (string.IsNullOrWhiteSpace(booking.Email))
        return Results.BadRequest(new { message = "Необходимо указать email." });

    if (booking.Hours <= 0)
        return Results.BadRequest(new { message = "Количество часов должно быть больше 0." });

    try
    {
        var createdBooking = storage.AddBooking(booking);
        return Results.Created($"/api/bookings/{createdBooking.Id}", createdBooking);
    }
    catch (InvalidOperationException ex)
    {
        return Results.BadRequest(new { message = ex.Message });
    }
});

app.MapGet("/api/bookings/{id:int}", (int id, JsonStorageService storage) =>
{
    var booking = storage.GetBookings().FirstOrDefault(b => b.Id == id);

    return booking is null
        ? Results.NotFound(new { message = "Бронирование не найдено" })
        : Results.Ok(booking);
});

app.Run();