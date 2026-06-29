const API_BASE_URL = 'http://localhost:5245';

async function getCoworkings() {
  const response = await fetch(`${API_BASE_URL}/api/coworkings`);
  return await response.json();
}

async function getCoworkingById(id) {
  const response = await fetch(`${API_BASE_URL}/api/coworkings/${id}`);
  return await response.json();
}

async function createBooking(data) {
  const response = await fetch(`${API_BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

async function getBookings() {
  const response = await fetch(`${API_BASE_URL}/api/bookings`);
  return await response.json();
}