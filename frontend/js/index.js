document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('popularCoworkings');

  try {
    const coworkings = await getCoworkings();

    container.innerHTML = '';

    coworkings.forEach(item => {
      const card = document.createElement('div');
      card.className = 'popular-card';

      const priceText = item.pricePerHour === 0
        ? 'Бесплатно'
        : `${item.pricePerHour} ₽ / час`;

      const noiseBadge = item.noiseLevel === 'Тихо'
        ? '<span class="noise-badge">Тихо</span>'
        : '';

      card.innerHTML = `
        <div class="popular-image">
          <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
          ${noiseBadge}
        </div>

        <div class="popular-body">
          <h3>${item.name}</h3>
          <p>м. ${item.metro}</p>

          <div class="popular-bottom">
            <strong>${priceText}</strong>
            <span>⭐ ${item.rating}</span>
          </div>

          <a href="booking.html?id=${item.id}" class="small-book-button">
            Забронировать
          </a>
        </div>
      `;

      container.appendChild(card);
    });

    const moreCard = document.createElement('a');
    moreCard.className = 'popular-card more-card';
    moreCard.href = 'catalog.html';
    moreCard.innerHTML = `
      <h3>Ещё больше коворкингов</h3>
      <p>Откройте полный каталог рабочих пространств.</p>
      <span>Перейти →</span>
    `;

    container.appendChild(moreCard);
  } catch (error) {
    container.innerHTML = '<p>Не удалось загрузить популярные коворкинги.</p>';
  }
});