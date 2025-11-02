import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const r = await API.post('/auth/login', { email, password });
            onLogin(r.data);
        } catch (err) {
            alert('login failed');
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
            <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    );
}
