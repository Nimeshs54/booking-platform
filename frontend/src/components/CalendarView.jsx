import React, { useEffect, useState } from 'react';
import API from '../api';
import { formatISO, addDays } from 'date-fns';
import io from 'socket.io-client';

export default function CalendarView({ resource, onBook }) {
    const [bookings, setBookings] = useState([]);
    const [from, setFrom] = useState(formatISO(new Date(), { representation: 'date' }));
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:4000';
    useEffect(() => {
        load();
        const socket = io(wsUrl);
        socket.emit('joinResource', { resourceId: resource.id });
        socket.on('booking.created', b => {
            load();
        });
        return () => {
            socket.emit('leaveResource', { resourceId: resource.id });
            socket.disconnect();
        };
    }, [resource, from]);

    async function load() {
        const toDate = addDays(new Date(from), 7);
        const r = await API.get(`/bookings/resource/${resource.id}/bookings?from=${from}&to=${formatISO(toDate)}`);
        setBookings(r.data);
    }

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div>Resource: {resource.name}</div>
                <button onClick={onBook}>Book slot</button>
            </div>

            <ul>
                {bookings.map(b => (
                    <li key={b.id}>
                        {new Date(b.start_ts).toLocaleString()} - {new Date(b.end_ts).toLocaleString()} by {b.user_id ? b.user_id : 'guest'}
                    </li>
                ))}
            </ul>
        </div>
    );
}
