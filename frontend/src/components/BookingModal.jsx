import React, { useState } from 'react';
import { formatISO } from 'date-fns';
import API from '../api';

export default function BookingModal({ resource, onClose, initialStart, initialEnd }) {
  const defaultStart = initialStart ? new Date(initialStart) : new Date();
  const defaultEnd = initialEnd
    ? new Date(initialEnd)
    : new Date(Date.now() + 60 * 60 * 1000);

  const [start, setStart] = useState(
    formatISO(defaultStart, { representation: 'complete' }).slice(0, 16),
  );
  const [end, setEnd] = useState(
    formatISO(defaultEnd, { representation: 'complete' }).slice(0, 16),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function book() {
    setError('');
    setLoading(true);
    try {
      const body = {
        start_ts: new Date(start).toISOString(),
        end_ts: new Date(end).toISOString(),
      };
      const r = await API.post(`/bookings/resource/${resource.id}/book`, body);
      alert('Booking created with id ' + r.data.id);
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Booking failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Create booking</h2>
            <p>Resource: {resource.name}</p>
          </div>
          <button className="button button-ghost button-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Start time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End time</label>
            <input
              type="datetime-local"
              className="form-input"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          {error && <div className="form-error">{error}</div>}
        </div>

        <div className="modal-footer">
          <button
            className="button button-primary"
            onClick={book}
            disabled={loading}
          >
            {loading ? 'Creating booking' : 'Confirm booking'}
          </button>
          <button className="button button-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
