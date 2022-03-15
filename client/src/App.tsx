import React, { FormEvent, useState } from "react";
import "./App.css";

function App() {
  const [duration, setDuration] = useState<string>("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(duration);
  };
  return (
    <div className="App">
      <header>Booking Calendar</header>
      <article>
        <form onSubmit={handleSubmit}>
          <label htmlFor="bookingDuration">
            Please provide a booking duration in minutes
            <input
              name="bookingDuration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={1}
            />
          </label>
          <button type="submit">Check availability</button>
        </form>
      </article>
    </div>
  );
}

export default App;
