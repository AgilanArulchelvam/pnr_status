import React, { useState } from "react";
import "./App.css";

interface PnrStatus {
  pnr: string;
  train_number: string;
  train_name: string;
  journey_date: string;
  from_station: string;
  to_station: string;
  travel_class: string;
  chart_prepared: boolean;
  booking_status: string;
  current_status: string;
}

const App: React.FC = () => {
  const [pnr, setPnr] = useState("");
  const [status, setStatus] = useState<PnrStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = /^\d{10}$/.test(pnr);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    setError("");
    setStatus(null);

    try {
      const res = await fetch(`/api/pnr-status/${pnr}`);
      if (!res.ok) throw new Error("Network error");
      const data: PnrStatus = await res.json();
      setStatus(data);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch PNR status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo">TravelMate</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">Bookings</a>
          <a href="#">Support</a>
        </nav>
      </header>

      <main>
        <div className="card">
          <h1 className="title">PNR Status</h1>

          <form className="pnr-form-inline" onSubmit={handleSubmit}>
            <input
              type="text"
              maxLength={10}
              placeholder="Enter 10‑digit PNR Number"
              value={pnr}
              onChange={(e) =>
                setPnr(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
            <button type="submit" disabled={!isValid || loading}>
              {loading ? "Checking…" : "Check PNR Status"}
            </button>
          </form>

          {error && <div className="status-box error">{error}</div>}

          {status && (
            <div className="status-box">
              <p>
                <strong>PNR:</strong> {status.pnr}
              </p>
              <p>
                <strong>Train:</strong> {status.train_number} –{" "}
                {status.train_name}
              </p>
              <p>
                <strong>Date:</strong> {status.journey_date}
              </p>
              <p>
                <strong>Route:</strong> {status.from_station} →{" "}
                {status.to_station}
              </p>
              <p>
                <strong>Class:</strong> {status.travel_class}
              </p>
              <p>
                <strong>Chart:</strong>{" "}
                {status.chart_prepared ? "Prepared" : "Not Prepared"}
              </p>
              <p>
                <strong>Booking:</strong> {status.booking_status}
              </p>
              <p>
                <strong>Current:</strong> {status.current_status}
              </p>
            </div>
          )}
        </div>

        <div className="qa-container">
          <div className="qa-box">
            <div className="qa-question">
              What does the acronym “PNR” stand for in the context of railway
              reservations?
            </div>
            <div className="qa-answer">
              Passenger Name Record. It is a unique ten‑digit number that holds
              your booking details (name, train, coach & berth) and lets you
              check or manage your ticket online.
            </div>
          </div>
          <div className="qa-box">
            <div className="qa-question">
              Which details can you find by checking your PNR status?
            </div>
            <div className="qa-answer">
              You’ll see your coach & berth allocation, booking status (CNF,
              RAC, WL), final reservation status after chart preparation, train
              name & number, date of travel, and boarding/destination stations.
            </div>
          </div>
          <div className="qa-box">
            <div className="qa-question">
              What do the common PNR status codes—CNF, RAC, WL—mean?
            </div>
            <div className="qa-answer">
              CNF = Confirmed berth; RAC = Reservation Against Cancellation (a
              half‑berth shared until a cancellation frees up); WL = Waitlist
              (in queue for a berth).
            </div>
          </div>
          <div className="qa-box">
            <div className="qa-question">
              How long is a railway PNR number valid for once a ticket is
              booked?
            </div>
            <div className="qa-answer">
              Your PNR is valid from booking until your journey completes. You
              can check it up through chart preparation (a few hours before
              departure) and on travel day; after the train run ends it expires.
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        © 2025 TravelMate. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
