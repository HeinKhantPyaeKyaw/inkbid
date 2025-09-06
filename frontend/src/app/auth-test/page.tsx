'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { useState } from 'react';

export default function AuthTestPage() {
  const { user, loading, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🔑 Auth Test Page</h1>

      {user ? (
        <div>
          <p>
            <strong>Logged in as:</strong> {user.email} ({user.role})
          </p>
          <button onClick={logout}>Log Out</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={() => login(email, password)}>Log In</button>
        </div>
      )}
    </div>
  );
}
