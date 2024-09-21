const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Seat data structure and reservation logic
let seats = [];

function initializeSeats() {
  let seatId = 1;
  for (let row = 1; row <= 12; row++) {
    const seatsInRow = row === 12 ? 3 : 7;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({
        id: seatId++,
        row: row,
        isBooked: false
      });
    }
  }
}

initializeSeats();

function findAvailableSeats(count) {
  for (let row = 1; row <= 12; row++) {
    const availableInRow = seats.filter(seat => seat.row === row && !seat.isBooked);
    if (availableInRow.length >= count) {
      return availableInRow.slice(0, count);
    }
  }

  const allAvailable = seats.filter(seat => !seat.isBooked);
  return allAvailable.slice(0, count);
}

app.post('/api/book', (req, res) => {
  const { seats: seatsToBook } = req.body;
  
  if (seatsToBook < 1 || seatsToBook > 7) {
    return res.status(400).json({ error: 'Can only book 1 to 7 seats at a time' });
  }

  const availableSeats = findAvailableSeats(seatsToBook);

  if (availableSeats.length < seatsToBook) {
    return res.status(400).json({ error: 'Not enough seats available' });
  }

  availableSeats.forEach(seat => {
    seat.isBooked = true;
  });

  res.json({ bookedSeats: availableSeats.map(seat => seat.id) });
});

app.get('/api/seats', (req, res) => {
  res.json(seats);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));