'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:4000/users?email=${encodeURIComponent(email)}`);
      const users = await res.json();

      if (!res.ok) {
        setError('Erreur serveur');
        return;
      }

      if (users.length === 0 || users[0].password !== password) {
        setError('Email ou mot de passe incorrect');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Erreur serveur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
      <h1 style={{ color: '#1B8C3E' }}>TaskFlow</h1>
      <p>Connectez-vous pour continuer</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#1B8C3E',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '0.75rem',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
