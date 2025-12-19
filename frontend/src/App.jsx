import React, { useEffect, useState } from 'react';
import API, { setAuthToken } from './api';

import Navbar from './components/Navbar';
import CalendarView from './components/CalendarView';
import BookingModal from './components/BookingModal';
import AISuggestions from './components/AISuggestions';
import PaymentPanel from './components/PaymentPanel';
import AuthModal from './components/AuthModal';

export default function App() {
  const [user, setUser] = useState(null);

  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [suggestedSlot, setSuggestedSlot] = useState(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token) setAuthToken(token);
    if (userJson) setUser(JSON.parse(userJson));

    loadResources();
  }, []);

  async function loadResources() {
    try {
      const r = await API.get('/bookings/resources');
      setResources(r.data || []);
      if (r.data?.length) setSelectedResource(r.data[0]);
    } catch (e) {
      console.error(e);
    }
  }

  function handleAuthSuccess(payload) {
    localStorage.setItem('token', payload.token);
    localStorage.setItem('user', JSON.stringify(payload.user));
    setAuthToken(payload.token);
    setUser(payload.user);
    setAuthOpen(false);
  }

  function handleLogout() {
    localStorage.clear();
    setAuthToken(null);
    setUser(null);
  }

  return (
    <>
      <Navbar
        user={user}
        onLogin={() => { setAuthMode('login'); setAuthOpen(true); }}
        onSignup={() => { setAuthMode('signup'); setAuthOpen(true); }}
        onLogout={handleLogout}
      />

      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-logo">BK</div>
            <div className="brand-text">
              <span className="brand-title">Booking Platform</span>
              <span className="brand-subtitle">Calendar view</span>
            </div>
          </div>

          <ul className="resource-list">
            {resources.map(r => (
              <li key={r.id}>
                <button
                  className={`resource-item ${selectedResource?.id === r.id ? 'resource-item-active' : ''}`}
                  onClick={() => setSelectedResource(r)}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="main-area">
          <header className="main-header">
            <h1>Bookings</h1>
            {!user && (
              <p style={{ color: '#9ca3af' }}>
                Login to create bookings and use AI recommendations.
              </p>
            )}
          </header>

          <section className="content-grid">
            <div className="card calendar-card">
              <div className="card-header">
                <h2>Calendar</h2>
                <button
                  className="button button-primary"
                  disabled={!user}
                  onClick={() => setBookingModalOpen(true)}
                >
                  New booking
                </button>
              </div>

              {selectedResource && (
                <CalendarView
                  resource={selectedResource}
                  readOnly={!user}
                />
              )}
            </div>

            <div className="side-column">
              <div className="card">
                <h2>AI slot suggestions</h2>
                <AISuggestions
                  resource={selectedResource}
                  disabled={!user}
                  onUseSuggestion={(s, e) => {
                    setSuggestedSlot({ start: s, end: e });
                    setBookingModalOpen(true);
                  }}
                />
              </div>

              <div className="card">
                <h2>Payments</h2>
                <PaymentPanel disabled={!user} />
              </div>
            </div>
          </section>

          {bookingModalOpen && user && selectedResource && (
            <BookingModal
              resource={selectedResource}
              initialStart={suggestedSlot?.start}
              initialEnd={suggestedSlot?.end}
              onClose={() => setBookingModalOpen(false)}
            />
          )}
        </main>
      </div>

      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onSuccess={handleAuthSuccess}
          onSwitchMode={setAuthMode}
        />
      )}
    </>
  );
}
