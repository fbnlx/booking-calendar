import { FormEvent, useState } from "react";
import "./App.css";
import { useLazyQuery } from "@apollo/client";
import TimeSlot, { GET_AVAILABLE_TIME_SLOTS } from "./components/TimeSlot";
import { BookingData, BookingVars } from "./types/booking";

function App() {
  const [duration, setDuration] = useState<string>("");
  const [getTimeSlots, { loading, error, data }] = useLazyQuery<
    BookingData,
    BookingVars
  >(GET_AVAILABLE_TIME_SLOTS);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    getTimeSlots({ variables: { durationInMinutes: duration } });
  };

  return (
    <div className="App">
      <header>Booking Calendar</header>
      <article>
        <form onSubmit={handleSubmit}>
          <label htmlFor="bookingDuration">
            Please provide a booking duration in minutes
          </label>
          <div className="input__container">
            <input
              id="bookingDuration"
              name="bookingDuration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={1}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Fetching..." : "Check availability"}
            </button>
          </div>
        </form>
      </article>
      {data && data.booking.length > 0 && (
        <div>
          <span className="results_text">Available time slots:</span>
          {data.booking.map((booking, idx) => (
            <TimeSlot
              key={`booking-${idx}`}
              photographer={booking.photographer.name}
              startTime={booking.timeSlot.starts}
              endTime={booking.timeSlot.ends}
            />
          ))}
        </div>
      )}
      {data && data.booking.length === 0 && (
        <div style={{ margin: "4rem", fontWeight: "bold", color: "#c95d5d" }}>
          No available time slots for this duration
        </div>
      )}
      {error && (
        <div>
          <span>Failed to fetch</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default App;
