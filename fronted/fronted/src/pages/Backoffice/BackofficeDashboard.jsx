import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getStats,
  getInterventionTypes,
  getRepairsInProgress,
  createInterventionType,
  logout,
  syncDatabase,
} from '../../services/api';
import { Button } from '../../components/Button/Button';
import { Card, CardHeader } from '../../components/Card/Card';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import styles from './BackofficeDashboard.module.scss';

const MAX_REPAIRS = 2;

function AnimatedCounter({ value, suffix = '', duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}{suffix}</>;
}

export function BackofficeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [types, setTypes] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formulaire Catalogue (Nouveau type)
  const [catalogForm, setCatalogForm] = useState({ nom: '', price: '', duration: '', description: '' });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('garage_user');
    if (!u) {
      navigate('/backoffice');
      return;
    }
    const parsedUser = JSON.parse(u);
    if (parsedUser.role !== 'admin') {
      localStorage.removeItem('garage_user'); // Sécurité : on déconnecte si pas admin
      navigate('/backoffice');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getStats().then((r) => setStats(r.data)),
      getInterventionTypes().then((r) => setTypes(r.data)),
      getRepairsInProgress().then((r) => setRepairs(r.data)),
    ]).finally(() => setLoading(false));
  }, [user]);

  async function handleLogout() {
    await logout();
    localStorage.removeItem('garage_user');
    navigate('/backoffice');
  }

  async function handleSync() {
    try {
      setLoading(true);
      await syncDatabase();
      alert('Synchronisation réussie !');
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      alert('Erreur lors de la synchronisation.');
    } finally {
      setLoading(false);
    }
  }

  function handleCatalogChange(e) {
    const { name, value } = e.target;
    setCatalogForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmitCatalog(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createInterventionType(catalogForm);
      setCatalogForm({ nom: '', price: '', duration: '', description: '' });
      setMessage('Nouveau type d\'intervention ajouté au catalogue.');
      const r = await getInterventionTypes();
      setTypes(r.data);
    } catch (_) {
      setMessage('Erreur lors de l\'enregistrement.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) return <div className={styles.loading}>Chargement…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.user}>
          <span>{user.name}</span>
          <Button variant="secondary" size="md" onClick={handleSync} style={{ marginRight: '10px' }}>
            Synchroniser
          </Button>
          <Button variant="ghost" size="md" onClick={handleLogout}>
            Déconnexion
          </Button>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Statistiques</h2>
        <div className={styles.stats}>
          <Card variant="hud" className={styles.statCard}>
            <CardHeader title="Réparations aujourd'hui" subtitle="Nombre" />
            <p className={styles.statValue}>
              <AnimatedCounter value={stats?.repairsToday ?? 0} />
            </p>
          </Card>
          <Card variant="hud" className={styles.statCard}>
            <CardHeader title="Chiffre d'affaires" subtitle="€" />
            <p className={styles.statValue}>
              <AnimatedCounter value={stats?.revenueToday ?? 0} />
              <span className={styles.suffix}> €</span>
            </p>
          </Card>
          <Card variant="hud" className={styles.statCard}>
            <CardHeader title="Clients" subtitle="Total" />
            <p className={styles.statValue}>
              <AnimatedCounter value={stats?.totalClients ?? 0} />
            </p>
          </Card>
          <Card variant="hud" className={styles.statCard}>
            <CardHeader title="Temps moyen" subtitle="Minutes" />
            <p className={styles.statValue}>
              <AnimatedCounter value={stats?.avgRepairTime ?? 0} />
              <span className={styles.suffix}> min</span>
            </p>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Catalogue des Interventions</h2>
        <Card variant="hud" className={styles.formCard}>
          <form onSubmit={handleSubmitCatalog} className={styles.form}>
            <label className={styles.label}>
              Nom du type
              <input
                type="text"
                name="nom"
                value={catalogForm.nom}
                onChange={handleCatalogChange}
                required
                placeholder="ex: Vidange"
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Prix (€)
              <input
                type="number"
                name="price"
                value={catalogForm.price}
                onChange={handleCatalogChange}
                min="0"
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Durée (HH:mm:ss)
              <input
                type="text"
                name="duration"
                value={catalogForm.duration}
                onChange={handleCatalogChange}
                placeholder="01:00:00"
                className={styles.input}
              />
            </label>
            <label className={styles.label} style={{ flexBasis: '100%' }}>
              Description
              <textarea
                name="description"
                value={catalogForm.description}
                onChange={handleCatalogChange}
                placeholder="Description des travaux..."
                className={styles.input}
                rows="2"
              />
            </label>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary" size="md" disabled={submitting}>
                Ajouter au catalogue
              </Button>
            </div>
          </form>
        </Card>
        {message && <p className={styles.message}>{message}</p>}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Liste des Interventions
        </h2>
        <div className={styles.repairs}>
          {types.length === 0 ? (
            <Card className={styles.empty}>Aucun type d'intervention configuré.</Card>
          ) : (
            types.map((t) => (
              <Card key={t.id} variant="hud" className={styles.repairCard}>
                <div className={styles.repairHeader}>
                  <span className={styles.plaque}>{t.label}</span>
                </div>
                <p className={styles.client}>{t.description}</p>
                <p className={styles.intervention}>
                  {t.basePrice} € · {typeof t.baseDuration === 'number' ? (t.baseDuration / 60) + ' min' : t.baseDuration}
                </p>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
