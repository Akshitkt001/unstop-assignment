import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [seats, setSeats] = useState([]);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get('/api/seats');
      setSeats(response.data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const bookSeats = async () => {
    try {
      const response = await axios.post('/api/book', { seats: seatsToBook });
      setBookedSeats(response.data.bookedSeats);
      fetchSeats();
    } catch (error) {
      console.error('Error booking seats:', error);
      alert(error.response?.data?.error || 'Failed to book seats');
    }
  };

  return (
    <div className="App">
      <h1>Train Seat Reservation System</h1>
      <div>
        <input
          type="number"
          min="1"
          max="7"
          value={seatsToBook}
          onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
        />
        <button onClick={bookSeats}>Book Seats</button>
      </div>
      <div className="seat-map">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
            title={`Seat ${seat.id}`}
          >
            {seat.id}
          </div>
        ))}
      </div>
      {bookedSeats.length > 0 && (
        <div>
          <h2>Your booked seats:</h2>
          <p>{bookedSeats.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;