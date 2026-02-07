import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import { seedDatabase } from '../../firebase/seed';
import { Button } from '../../components/Button/Button';
import styles from './BackofficeLogin.module.scss';

export function BackofficeLogin() {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState('');
  useEffect(() => {
    if (localStorage.getItem('garage_user')) navigate('/backoffice/dashboard');
  }, [navigate]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(loginValue, password);
    setLoading(false);
    if (res.ok) {
      localStorage.setItem('garage_user', JSON.stringify(res.user));
      navigate('/backoffice/dashboard');
    } else {
      // Pour la démo : si Firebase Auth renvoie une erreur mais qu'on veut tester, 
      // on peut garder un bypass ou simplement afficher l'erreur.
      // Ici on reste strict sur Firebase selon la demande.
      setError(res.error || 'Erreur de connexion');
    }
  }

  async function handleSeed() {
    setLoading(true);
    const res = await seedDatabase();
    setLoading(false);
    if (res.ok) {
      alert('Base de données initialisée avec succès !');
    } else {
      alert('Erreur lors de l\'initialisation : ' + res.error);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.scanline} aria-hidden="true" />
      <div className={styles.corner} data-corner="tl" />
      <div className={styles.corner} data-corner="tr" />
      <div className={styles.corner} data-corner="bl" />
      <div className={styles.corner} data-corner="br" />

      <section className={styles.console}>
        <div className={styles.header}>
          <span className={styles.badge}>CONSOLE GARAGE</span>
          <span className={styles.status}>[ AUTH REQUISE ]</span>
        </div>
        <h1 className={styles.title}>Accès Backoffice</h1>
        <p className={styles.subtitle}>
          Identifiez-vous pour accéder au tableau de bord.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            <span>Login</span>
            <input
              type="text"
              value={loginValue}
              onChange={(e) => setLoginValue(e.target.value)}
              placeholder="admin"
              required
              autoComplete="username"
              className={styles.input}
            />
          </label>
          <label className={styles.label}>
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={styles.input}
            />
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}>
            <Button type="submit" variant="primary" size="lg" disabled={loading}>
              {loading ? 'Connexion…' : 'Connexion'}
            </Button>
            <Button variant="ghost" size="md" to="/">
              Retour accueil
            </Button>
          </div>
          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '10px' }}>
            <Button type="button" variant="secondary" size="sm" onClick={handleSeed} disabled={loading}>
              Initialiser la base de données (Seed)
            </Button>
          </div>
        </form>

        <p className={styles.hint}>
          Démo : <code>admin</code> / <code>garage2025</code>
        </p>
      </section>
    </div>
  );
}
