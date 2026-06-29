document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('coworkingDetails');
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const coworking = await getCoworkingById(id);

  container.innerHTML = `
    <div class="details-card">
      <div class="details-image">
        <img src="${coworking.imageUrl || 'images/placeholder.jpg'}" alt="${coworking.name}" loading="lazy">
      </div>

      <div class="details-info">
        <h1>${coworking.name}</h1>
        <p class="muted">${coworking.metro} • ${coworking.district}</p>
        <p>${coworking.description}</p>

        <p><strong>Адрес:</strong> ${coworking.address}</p>
        <p><strong>Рейтинг:</strong> ⭐ ${coworking.rating}</p>
        <p><strong>Уровень шума:</strong> ${coworking.noiseLevel}</p>
        <p><strong>Тип места:</strong> ${coworking.type}</p>

        <div class="amenities">
          ${coworking.amenities.map(item => `<span>${item}</span>`).join('')}
        </div>

        <h2>${coworking.pricePerHour} ₽ / час</h2>

        <a class="button button-green" href="booking.html?id=${coworking.id}">
          Забронировать
        </a>
      </div>
    </div>
  `;
});