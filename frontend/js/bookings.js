document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('bookingsList');

  list.innerHTML = '<p>Загрузка бронирований...</p>';

  try {
    const bookings = await getBookings();

    list.innerHTML = '';

    if (!bookings || bookings.length === 0) {
      list.innerHTML = '<p>Бронирования пока отсутствуют.</p>';
      return;
    }

    bookings
      .sort((a, b) => b.id - a.id)
      .forEach(booking => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
          <h3>Бронирование №${booking.id}</h3>
          <p><strong>Имя:</strong> ${booking.customerName}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Дата:</strong> ${booking.date}</p>
          <p><strong>Время:</strong> ${booking.startTime}</p>
          <p><strong>Количество часов:</strong> ${booking.hours}</p>
          <p><strong>Стоимость:</strong> ${booking.totalPrice} ₽</p>
          <p><strong>Статус:</strong> ${booking.status}</p>
        `;

        list.appendChild(card);
      });
  } catch (error) {
    list.innerHTML = '<p>Ошибка загрузки. Проверьте, запущен ли backend.</p>';
    console.error(error);
  }
});