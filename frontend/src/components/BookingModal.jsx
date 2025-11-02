import React, { useState } from 'react';
import API from '../api';
import { formatISO } from 'date-fns';

export default function BookingModal({ resource, onClose }) {
    const [start, setStart] = useState(formatISO(new Date(), { representation: 'complete' }).slice(0, 16));
    const [end, setEnd] = useState(formatISO(new Date(Date.now() + 3600000), { representation: 'complete' }).slice(0, 16));
    const [loading, setLoading] = useState(false);

    async function book() {
        setLoading(true);
        try {
            const body = { start_ts: new Date(start).toISOString(), end_ts: new Date(end).toISOString() };
            const r = await API.post(`/bookings/resource/${resource.id}/book`, body);
            alert('booked: ' + r.data.id);
            onClose();
        } catch (err) {
            console.error(err);
            alert(err?.response?.data?.error || 'booking failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card" style={{ position: 'fixed', left: '50%', top: '30%', transform: 'translate(-50%,-30%)', zIndex: 50 }}>
            <h3>Book {resource.name}</h3>
            <div>
                <label>Start</label>
                <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
            </div>
            <div>
                <label>End</label>
                <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
            </div>
            <div style={{ marginTop: 8 }}>
                <button onClick={book} disabled={loading}>Confirm</button>
                <button onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
        </div>
    );
}
