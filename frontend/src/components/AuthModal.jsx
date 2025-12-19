import React, { useState } from 'react';
import API from '../api';

export default function AuthModal({ mode, onClose, onSuccess, onSwitchMode }) {
  const isLogin = mode === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const r = await API.post(endpoint, { email, password });
      onSuccess && onSuccess(r.data);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || (isLogin ? 'Login failed' : 'Signup failed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{isLogin ? 'Login' : 'Create account'}</h2>
            <p>{isLogin ? 'Sign in to access the dashboard.' : 'Sign up to start booking.'}</p>
          </div>
          <button className="button button-ghost button-sm" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="modal-body" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-footer">
            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? (isLogin ? 'Signing in' : 'Creating') : (isLogin ? 'Login' : 'Sign up')}
            </button>

            <button
              className="button button-ghost"
              type="button"
              onClick={() => onSwitchMode(isLogin ? 'signup' : 'login')}
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
