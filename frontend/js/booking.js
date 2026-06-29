document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const coworkingId = Number(params.get('id'));

  const form = document.getElementById('bookingForm');
  const selectedCoworking = document.getElementById('selectedCoworking');

  const nameInput = document.getElementById('customerName');
  const emailInput = document.getElementById('email');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('startTime');
  const hoursInput = document.getElementById('hours');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const dateError = document.getElementById('dateError');
  const timeError = document.getElementById('timeError');

  if (!coworkingId) {
    selectedCoworking.innerHTML = `
      <h3>Коворкинг не выбран</h3>
      <p>Вернитесь в каталог и нажмите «Забронировать».</p>
      <a href="catalog.html" class="button button-green">Перейти в каталог</a>
    `;
    form.style.display = 'none';
    return;
  }

  function formatDateLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function fillTimeOptions() {
    timeInput.innerHTML = '<option value="">Выберите время</option>';

    const selectedDate = dateInput.value;
    const now = new Date();

    for (let hour = 8; hour <= 22; hour++) {
      for (const minute of [0, 30]) {
        const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        const optionDate = new Date(`${selectedDate}T${value}`);

        if (selectedDate === formatDateLocal(now) && optionDate <= now) {
          continue;
        }

        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        timeInput.appendChild(option);
      }
    }
  }

  const today = formatDateLocal(new Date());
  dateInput.min = today;
  dateInput.value = today;

  fillTimeOptions();
  dateInput.addEventListener('change', fillTimeOptions);

  const coworking = await getCoworkingById(coworkingId);

  const priceText = coworking.pricePerHour === 0
    ? 'Бесплатно'
    : `${coworking.pricePerHour} ₽ / час`;

  const noiseText = coworking.noiseLevel === 'Тихо'
    ? ' • Тихо'
    : '';

  selectedCoworking.innerHTML = `
    <h3>${coworking.name}</h3>
    <p class="metro-line"><span class="metro-dot"></span>${coworking.metro}</p>
    <p><strong>${priceText}</strong></p>
    <p>⭐ ${coworking.rating}${noiseText}</p>
  `;

  function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    dateError.textContent = '';
    timeError.textContent = '';
  }

  function isValidName(value) {
    return /^[А-Яа-яЁё\s-]{2,}$/.test(value.trim());
  }

  function isValidEmail(value) {
    const email = value.trim();
    return email.includes('@') && email.includes('.') && email.length >= 5;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    let valid = true;

    if (!isValidName(nameInput.value)) {
      nameError.textContent = 'Введите имя русскими буквами.';
      valid = false;
    }

    if (!isValidEmail(emailInput.value)) {
      emailError.textContent = 'Введите корректный email.';
      valid = false;
    }

    if (!dateInput.value) {
      dateError.textContent = 'Выберите дату.';
      valid = false;
    }

    if (!timeInput.value) {
      timeError.textContent = 'Выберите время начала.';
      valid = false;
    }

    if (!valid) {
      return;
    }

    const booking = {
      coworkingId: coworkingId,
      customerName: nameInput.value.trim(),
      email: emailInput.value.trim(),
      date: dateInput.value,
      startTime: timeInput.value,
      hours: Number(hoursInput.value),
      comment: ''
    };

    try {
      const created = await createBooking(booking);

      if (!created || !created.id) {
        alert('Бронирование не было создано. Проверьте backend.');
        return;
      }

      window.location.href = 'index.html?booked=1';
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании бронирования. Проверьте backend.');
    }
  });
});