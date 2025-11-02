import React, { useEffect, useState } from 'react';
import API, { setAuthToken } from './api';
import Login from './components/Login';
import CalendarView from './components/CalendarView';
import BookingModal from './components/BookingModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      // we could fetch user info; for now store token
      setUser({ email: 'me' });
    }
    loadResources();
  }, []);

  async function loadResources() {
    const r = await API.get('/bookings/resources');
    setResources(r.data);
    if (r.data.length > 0 && !selectedResource) setSelectedResource(r.data[0]);
  }

  function handleLogin({ token, user }) {
    localStorage.setItem('token', token);
    setAuthToken(token);
    setUser(user);
  }

  return (
    <div className="app">
      <div className="header">
        <h2>Booking Platform</h2>
        <div>
          {!user ? <Login onLogin={handleLogin} /> : <span>Signed in as {user.email || user.name}</span>}
        </div>
      </div>

      <div className="resource-list">
        {resources.map(r => (
          <div key={r.id} className="card" style={{ cursor: 'pointer', background: selectedResource?.id === r.id ? '#eef' : '#fff' }} onClick={() => setSelectedResource(r)}>
            <strong>{r.name}</strong>
            <div>{r.timezone}</div>
          </div>
        ))}
      </div>

      {selectedResource && (
        <div className="calendar">
          <CalendarView resource={selectedResource} onBook={() => setModalOpen(true)} />
        </div>
      )}

      {modalOpen && <BookingModal resource={selectedResource} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
