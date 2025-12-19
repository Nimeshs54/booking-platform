import React from 'react';

export default function Navbar({ user, onLogin, onSignup, onLogout }) {
  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <div className="topbar-logo">Booking Platform</div>
          <div className="topbar-tagline">AI powered bookings</div>
        </div>

        <div className="topbar-right">
          {!user ? (
            <>
              <button className="button button-ghost" onClick={onLogin}>Login</button>
              <button className="button button-primary" onClick={onSignup}>Sign up</button>
            </>
          ) : (
            <>
              <span className="topbar-user">{user.email}</span>
              <button className="button button-ghost" onClick={onLogout}>Log out</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
