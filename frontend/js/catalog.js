document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('coworkingsList');
  const searchInput = document.getElementById('searchInput');
  const nameSuggestions = document.getElementById('nameSuggestions');
  const metroInput = document.getElementById('metroInput');
  const metroDatalist = document.getElementById('metroStations');
  const maxPriceInput = document.getElementById('maxPriceInput');
  const quietFilter = document.getElementById('quietFilter');
  const amenityFilters = document.querySelectorAll('.amenityFilter');
  const searchButton = document.getElementById('searchButton');
  const searchHint = document.getElementById('searchHint');

  let coworkings = await getCoworkings();
  coworkings = coworkings.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

  function normalize(text) {
    return String(text).toLowerCase().replaceAll('ё', 'е').trim();
  }

  function getAliases(name) {
    const aliases = {
      'SixOne Space': 's с си сикс ван сиксван сикс уан',
      'Work Point': 'w в ворк поинт воркпоинт',
      'Focus Point': 'f ф фокус поинт фокуспоинт',
      'Open Flow': 'o о опен флоу опенфлоу',
      'Green Desk': 'g г грин деск гриндеск'
    };
    return aliases[name] || '';
  }

  function getMetroColor(metro) {
    const colors = {
      'Арбатская': '#0078be',
      'Белорусская': '#8fd400',
      'Курская': '#8b4513',
      'Павелецкая': '#2dbb55',
      'Улица 1905 года': '#8b4a9c'
    };
    return colors[metro] || '#6f7fc4';
  }

  function getPriceText(price) {
    return price === 0 ? 'Бесплатно' : `${price} ₽ / час`;
  }

  function fillMetroSuggestions() {
    metroDatalist.innerHTML = '';

    const metros = [...new Set(coworkings.map(item => item.metro))]
      .sort((a, b) => a.localeCompare(b, 'ru'));

    metros.forEach(metro => {
      metroDatalist.innerHTML += `<option value="${metro}">`;
    });
  }

  function setMaxPricePlaceholder() {
    const maxPrice = Math.max(...coworkings.map(item => item.pricePerHour));
    maxPriceInput.placeholder = `Цена до ${maxPrice} ₽`;
  }

  function showNameSuggestions() {
    const query = normalize(searchInput.value);
    nameSuggestions.innerHTML = '';

    if (!query) {
      nameSuggestions.style.display = 'none';
      return;
    }

    const matches = coworkings.filter(item => {
      const name = normalize(item.name);
      const aliases = normalize(getAliases(item.name));
      return name.includes(query) || aliases.includes(query);
    });

    if (matches.length === 0) {
      nameSuggestions.style.display = 'none';
      return;
    }

    matches.forEach(item => {
      const option = document.createElement('div');
      option.className = 'suggestion-item';
      option.textContent = item.name;

      option.addEventListener('click', () => {
        searchInput.value = item.name;
        nameSuggestions.style.display = 'none';

      });

      nameSuggestions.appendChild(option);
    });

    nameSuggestions.style.display = 'block';
  }

  function render(items) {
    list.innerHTML = '';

    if (items.length === 0) {
      list.innerHTML = '<p>Коворкинги не найдены. Попробуйте изменить фильтры.</p>';
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card coworking-card';

      const amenities = item.amenities.map(a => `<span>${a}</span>`).join('');
      const noiseBadge = item.noiseLevel === 'Тихо'
        ? '<span class="noise-badge">Тихо</span>'
        : '';

      card.innerHTML = `
        <div class="coworking-image">
          <img src="${item.imageUrl}" alt="${item.name}" loading="lazy">
          ${noiseBadge}
        </div>

        <div class="coworking-card-body">
          <h3>${item.name}</h3>

          <p class="metro-line">
            <span class="metro-dot" style="background:${getMetroColor(item.metro)}"></span>
            ${item.metro}
          </p>

          <p class="card-description">${item.description}</p>

          <div class="amenities compact">${amenities}</div>

          <div class="card-bottom">
            <div>
              <strong>${getPriceText(item.pricePerHour)}</strong>
              <p class="rating">⭐ ${item.rating}</p>
            </div>

            <a class="button button-green" href="booking.html?id=${item.id}">
              Забронировать
            </a>
          </div>
        </div>
      `;

      list.appendChild(card);
    });
  }

  function applyFilters() {
    const query = normalize(searchInput.value);
    const metro = normalize(metroInput.value);
    const maxPrice = Number(maxPriceInput.value);
    const onlyQuiet = quietFilter.checked;

    const selectedAmenities = [...amenityFilters]
      .filter(input => input.checked)
      .map(input => input.value);

    const filtered = coworkings.filter(item => {
      const name = normalize(item.name);
      const aliases = normalize(getAliases(item.name));
      const itemMetro = normalize(item.metro);

      const byName = !query || name.includes(query) || aliases.includes(query);
      const byMetro = !metro || itemMetro.includes(metro);
      const byPrice = !maxPrice || item.pricePerHour <= maxPrice;
      const byQuiet = !onlyQuiet || item.noiseLevel === 'Тихо';
      const byAmenities = selectedAmenities.every(a => item.amenities.includes(a));

      return byName && byMetro && byPrice && byQuiet && byAmenities;
    });

    nameSuggestions.style.display = 'none';
    searchHint.textContent = `Найдено: ${filtered.length}`;
    render(filtered);
  }

  function markChanged() {
    // Подсказку не показываем, чтобы интерфейс оставался чистым.
  }

  fillMetroSuggestions();
  setMaxPricePlaceholder();
  render(coworkings);
  searchHint.textContent = `Всего коворкингов: ${coworkings.length}`;

  searchInput.addEventListener('input', () => {
    showNameSuggestions();
    markChanged();
  });

  metroInput.addEventListener('input', markChanged);
  maxPriceInput.addEventListener('input', markChanged);
  quietFilter.addEventListener('change', markChanged);

  amenityFilters.forEach(input => {
    input.addEventListener('change', markChanged);
  });

  searchButton.addEventListener('click', applyFilters);

  document.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyFilters();
    }
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.suggest-wrapper')) {
      nameSuggestions.style.display = 'none';
    }
  });
});