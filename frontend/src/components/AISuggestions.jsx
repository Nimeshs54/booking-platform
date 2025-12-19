import React, { useState } from 'react';
import API from '../api';

export default function AISuggestions({ resource, onUseSuggestion }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [rawResponse, setRawResponse] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setRawResponse('');
    setSuggestions([]);
    setLoading(true);

    try {
      const payload = { prompt };
      if (resource) {
        payload.resourceId = resource.id;
      }
      const r = await API.post('/ai/suggest-slots', payload);
      if (Array.isArray(r.data?.suggestions)) {
        setSuggestions(r.data.suggestions);
      } else if (r.data?.raw) {
        setRawResponse(r.data.raw);
      } else {
        setError('AI response did not contain suggestions.');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || 'AI request failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function resolveTimeFields(s) {
    const start =
      s.start ||
      s.startISO ||
      s.startIso ||
      s.start_ts ||
      s.startTime ||
      s.from ||
      null;
    const end =
      s.end ||
      s.endISO ||
      s.endIso ||
      s.end_ts ||
      s.endTime ||
      s.to ||
      null;
    const reason = s.reason || s.explanation || s.note || '';
    return { start, end, reason };
  }

  return (
    <div className="ai-panel">
      <form className="ai-form" onSubmit={handleSubmit}>
        <textarea
          className="ai-textarea"
          placeholder={
            resource
              ? 'Example: I need a 1 hour slot next Tuesday afternoon for this resource.'
              : 'Select a resource first, then describe the kind of time slot you need.'
          }
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          disabled={!resource || loading}
        />
        <button
          type="submit"
          className="button button-primary button-full"
          disabled={!resource || loading || !prompt.trim()}
        >
          {loading ? 'Asking the model' : 'Ask AI for suggestions'}
        </button>
      </form>

      {!resource && (
        <p className="ai-hint">
          Pick a resource on the left to allow the model to tailor suggestions.
        </p>
      )}

      {error && <div className="form-error">{error}</div>}

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s, idx) => {
            const { start, end, reason } = resolveTimeFields(s);
            return (
              <li key={idx} className="suggestion-item">
                <div className="suggestion-main">
                  <div className="suggestion-time">
                    {start && end ? (
                      <>
                        <span>{new Date(start).toLocaleString()}</span>
                        <span className="booking-arrow">to</span>
                        <span>{new Date(end).toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="suggestion-raw-json">
                        {JSON.stringify(s)}
                      </span>
                    )}
                  </div>
                  {reason && <div className="suggestion-reason">{reason}</div>}
                </div>
                {start && end && (
                  <button
                    type="button"
                    className="button button-secondary button-sm"
                    onClick={() => onUseSuggestion && onUseSuggestion(start, end)}
                  >
                    Use this slot
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {rawResponse && !suggestions.length && (
        <pre className="ai-raw-response">{rawResponse}</pre>
      )}
    </div>
  );
}
