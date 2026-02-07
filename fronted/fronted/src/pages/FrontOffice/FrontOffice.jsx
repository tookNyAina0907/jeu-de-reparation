import { useEffect, useState } from 'react';
import { getUsers, getClients, getRepairsInProgress, getWaitingSlot, getInterventionTypes, createIntervention } from '../../services/api';
import { Card, CardHeader } from '../../components/Card/Card';
import { Button } from '../../components/Button/Button';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import styles from './FrontOffice.module.scss';

const MAX_REPAIRS = 2;

export function FrontOffice() {
  const [users, setUsers] = useState([]); // Liste pour l'affichage "Utilisateurs"
  const [carsList, setCarsList] = useState([]); // Liste pour le select "Véhicule"
  const [repairs, setRepairs] = useState([]);
  const [waiting, setWaiting] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [repairForm, setRepairForm] = useState({ typeId: '', voitureId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      getUsers().then((r) => setUsers(r.data.filter(u => u.role === 'client'))),
      getClients().then((r) => setCarsList(r.data)),
      getRepairsInProgress().then((r) => setRepairs(r.data)),
      getWaitingSlot().then((r) => setWaiting(r.data)),
      getInterventionTypes().then((r) => setTypes(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  function handleRepairChange(e) {
    const { name, value } = e.target;
    setRepairForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmitRepair(e) {
    e.preventDefault();
    if (repairs.length >= MAX_REPAIRS) {
      setMessage(`Désolé, le garage est plein (${MAX_REPAIRS} réparations max).`);
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const selectedType = types.find(t => t.id === repairForm.typeId);
      await createIntervention({
        typeId: repairForm.typeId,
        voitureId: repairForm.voitureId,
        price: selectedType?.basePrice || 0,
        duration: selectedType?.baseDuration || 0
      });
      setRepairForm({ typeId: '', voitureId: '' });
      setMessage('Réparation lancée avec succès !');
      // Refresh pairs
      const r = await getRepairsInProgress();
      setRepairs(r.data);
    } catch (_) {
      setMessage('Erreur lors du lancement de la réparation.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className={styles.loading}>Chargement…</div>;
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>FrontOffice</h1>
      <p className={styles.subtitle}>
        Vue publique — clients, réparations en cours et file d&apos;attente.
      </p>

      <section className={styles.section} id="launch-repair">
        <h2 className={styles.sectionTitle}>
          Lancer une Réparation
          <span className={styles.badge}>{repairs.length} / {MAX_REPAIRS} actives</span>
        </h2>
        <Card variant="hud" className={styles.formCard}>
          <form onSubmit={handleSubmitRepair} className={styles.form}>
            <label className={styles.label}>
              Type d'intervention
              <select
                name="typeId"
                value={repairForm.typeId}
                onChange={handleRepairChange}
                required
                className={styles.select}
              >
                <option value="">— Choisir Type —</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </label>
            <label className={styles.label}>
              Véhicule (Client)
              <select
                name="voitureId"
                value={repairForm.voitureId}
                onChange={handleRepairChange}
                required
                className={styles.select}
              >
                <option value="">— Choisir Véhicule —</option>
                {carsList.map((c) => (
                  <option key={c.id} value={c.id}>{c.plaque} ({c.nom})</option>
                ))}
              </select>
            </label>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary" size="md" disabled={submitting}>
                Lancer la réparation
              </Button>
            </div>
          </form>
        </Card>
        {message && <p className={styles.message}>{message}</p>}
      </section>

      <section className={styles.section} id="users">
        <h2 className={styles.sectionTitle}>Utilisateurs</h2>
        <div className={styles.clients}>
          {users.length === 0 ? (
            <Card className={styles.empty}>Aucun utilisateur enregistré.</Card>
          ) : (
            users.map((u) => (
              <Card key={u.id} variant="hud" className={styles.clientCard}>
                <div className={styles.clientHeader}>
                  <span className={styles.name}>{u.nom}</span>
                </div>
                <p className={styles.vehicule}>{u.email}</p>
                <p className={styles.tel}>{u.contact || 'Pas de contact'}</p>
              </Card>
            ))
          )}
        </div>
      </section>

      <section className={styles.section} id="repairs">
        <h2 className={styles.sectionTitle}>Réparations en cours</h2>
        <div className={styles.repairs}>
          {repairs.length === 0 ? (
            <Card className={styles.empty}>Aucune réparation en cours.</Card>
          ) : (
            repairs.map((r) => (
              <Card key={r.id} variant="hud" className={styles.repairCard}>
                <div className={styles.repairHeader}>
                  <span className={styles.plaque}>{r.plaque}</span>
                  <span className={styles.vehicule}>{r.vehicule}</span>
                </div>
                <p className={styles.client}>{r.clientName}</p>
                <p className={styles.intervention}>
                  {r.intervention?.type} — {r.intervention?.price} €
                </p>
                {r.intervention?.description && (
                  <p className={styles.description}>{r.intervention.description}</p>
                )}
                <ProgressBar
                  value={r.progress}
                  label="Avancement"
                  showPercent={true}
                  animated={true}
                />
              </Card>
            ))
          )}
        </div>
      </section>

      <section className={styles.section} id="waiting">
        <h2 className={styles.sectionTitle}>
          Slot d&apos;attente
          <span className={styles.badge}>1 voiture max</span>
        </h2>
        <div className={styles.waiting}>
          {waiting.length === 0 ? (
            <Card className={styles.empty}>Aucun véhicule en attente.</Card>
          ) : (
            waiting.map((w) => (
              <Card key={w.id} variant="hud" className={styles.waitingCard}>
                <div className={styles.waitingHeader}>
                  <span className={styles.position}>#{w.position}</span>
                  <span className={styles.plaque}>{w.plaque}</span>
                </div>
                <p className={styles.vehicule}>{w.vehicule}</p>
                <p className={styles.client}>{w.clientName}</p>
                <p className={styles.intervention}>
                  {w.intervention?.type} — {w.intervention?.price} €
                </p>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
