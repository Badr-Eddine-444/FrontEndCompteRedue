import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import api from '../../api/axios';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  useEffect(() => {
    if (state.user) navigate(from, { replace: true });
  }, [state.user, navigate, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'LOGIN_START' });
    try {
      const { data: users } = await api.get<Array<{ id: string; name: string; email: string; password: string }>>(
        `/users?email=${encodeURIComponent(email)}`
      );
      if (users.length === 0 || users[0].password !== password) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Email ou mot de passe incorrect' });
        return;
      }
      const row = users[0];
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { id: row.id, name: row.name, email: row.email },
      });
    } catch {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Erreur serveur' });
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Connectez-vous pour continuer</p>
        {state.error && <div className={styles.error}>{state.error}</div>}
        <input
          type="email"
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button} disabled={state.loading}>
          {state.loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
