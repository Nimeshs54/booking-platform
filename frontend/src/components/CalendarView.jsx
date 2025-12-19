import React, { useEffect, useMemo, useState } from 'react';
import API from '../api';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00–20:00

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function CalendarView({ resource, readOnly }) {
  const [bookings, setBookings] = useState([]);

  const days = useMemo(() => {
    const base = startOfDay(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  useEffect(() => {
    if (!resource) return;

    API.get(`/bookings/resource/${resource.id}/bookings`, {
      params: {
        from: days[0].toISOString(),
        to: days[6].toISOString(),
      },
    })
      .then(r => setBookings(r.data || []))
      .catch(console.error);
  }, [resource, days]);

  function bookingAt(day, hour) {
    return bookings.find(b => {
      const s = new Date(b.start_ts);
      return (
        s.getDate() === day.getDate() &&
        s.getHours() === hour
      );
    });
  }

  return (
    <div className="calendar-grid">
      <div className="calendar-header">
        <div />
        {days.map(d => (
          <div key={d.toISOString()} className="calendar-day">
            {d.toLocaleDateString(undefined, {
              weekday: 'short',
              day: 'numeric',
            })}
          </div>
        ))}
      </div>

      {HOURS.map(hour => (
        <div key={hour} className="calendar-row">
          <div className="calendar-hour">{hour}:00</div>

          {days.map(day => {
            const booking = bookingAt(day, hour);

            return (
              <div
                key={day.toISOString() + hour}
                className={
                  'calendar-cell ' +
                  (booking ? 'calendar-cell-booked' : '') +
                  (readOnly ? ' calendar-cell-disabled' : '')
                }
                title={
                  booking
                    ? `Booked ${new Date(booking.start_ts).toLocaleTimeString()}`
                    : readOnly
                    ? 'Login to book'
                    : 'Available'
                }
              >
                {booking ? 'Booked' : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
