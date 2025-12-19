import React, { useState } from 'react';
import API from '../api';

export default function PaymentPanel() {
  const [bookingId, setBookingId] = useState('');
  const [amount, setAmount] = useState('49.00');
  const [currency, setCurrency] = useState('usd');
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');

  async function handleCreateIntent(e) {
    e.preventDefault();
    setError('');
    setClientSecret('');
    setLoading(true);

    try {
      const cents = Math.round(parseFloat(amount) * 100);
      const r = await API.post('/payments/create-intent', {
        bookingId,
        amountCents: cents,
        currency,
      });
      if (r.data?.clientSecret) {
        setClientSecret(r.data.clientSecret);
      } else {
        setError('No client secret returned. Check backend logs.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'Stripe request failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="payment-panel">
      <form className="payment-form" onSubmit={handleCreateIntent}>
        <div className="form-group">
          <label className="form-label">Booking id</label>
          <input
            className="form-input"
            placeholder="Existing booking id"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            required
          />
        </div>
        <div className="payment-row">
          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Currency</label>
            <select
              className="form-input"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
            </select>
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <button
          className="button button-secondary button-full"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating payment intent' : 'Create payment intent'}
        </button>
      </form>

      {clientSecret && (
        <div className="payment-result">
          <p className="payment-hint">
            This client secret would normally be passed into Stripe Elements on the
            frontend to complete the payment.
          </p>
          <pre className="payment-secret">{clientSecret}</pre>
        </div>
      )}
    </div>
  );
}
