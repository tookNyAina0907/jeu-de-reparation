import { useEffect, useState } from 'react';
import { getUserRepairHistory } from '../../services/api';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import styles from './ClientHistoryModal.module.scss';

export function ClientHistoryModal({ userId, userName, onClose }) {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchHistory() {
            setLoading(true);
            setError(null);

            const result = await getUserRepairHistory(userId);

            if (result.ok) {
                setHistory(result.data);
            } else {
                setError(result.error || 'Erreur lors du chargement de l\'historique');
            }

            setLoading(false);
        }

        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    if (!userId) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Historique des Réparations</h2>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer">
                        ✕
                    </button>
                </div>

                <div className={styles.userInfo}>
                    <p className={styles.userName}>{history?.user?.nom || userName}</p>
                    <p className={styles.userEmail}>{history?.user?.email}</p>
                    {history?.user?.contact && (
                        <p className={styles.userContact}>{history.user.contact}</p>
                    )}
                </div>

                <div className={styles.content}>
                    {loading && (
                        <div className={styles.loading}>Chargement de l'historique...</div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            <p>❌ {error}</p>
                        </div>
                    )}

                    {!loading && !error && history?.repairs?.length === 0 && (
                        <Card className={styles.empty}>
                            <p>Aucune réparation dans l'historique</p>
                        </Card>
                    )}

                    {!loading && !error && history?.repairs?.length > 0 && (
                        <div className={styles.repairsList}>
                            {history.repairs.map((repair) => (
                                <Card key={repair.id} variant="hud" className={styles.repairCard}>
                                    <div className={styles.repairHeader}>
                                        <span className={styles.repairType}>{repair.type_intervention}</span>
                                        <span className={styles.repairPrice}>{repair.prix} €</span>
                                    </div>

                                    <div className={styles.repairDetails}>
                                        <p className={styles.repairVehicle}>
                                            🚗 Véhicule : <strong>{repair.voiture}</strong>
                                        </p>
                                        <p className={styles.repairDate}>
                                            📅 Date : <strong>{new Date(repair.date).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</strong>
                                        </p>
                                        <p className={styles.repairStatus}>
                                            Statut : <span className={styles.statusBadge}>{repair.statut}</span>
                                        </p>
                                    </div>

                                    {repair.description && (
                                        <p className={styles.repairDescription}>{repair.description}</p>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <Button variant="secondary" onClick={onClose}>
                        Fermer
                    </Button>
                </div>
            </div>
        </div>
    );
}
