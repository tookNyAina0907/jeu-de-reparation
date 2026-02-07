import { Link } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import styles from './Home.module.scss';

export function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.scanline} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <section className={styles.hero}>
        <div className={styles.badge}>SIMULATION v1.0</div>
        <h1 className={styles.title}>
          <span className={styles.titleLine1}>GARAGE</span>
          <span className={styles.titleLine2}>SIMULATION</span>
        </h1>
        <p className={styles.tagline}>
          Système de gestion — Atelier automobile
        </p>
        <div className={styles.gauges}>
          <div className={styles.gauge}>
            <div className={styles.gaugeBar} style={{ '--val': '78%' }} />
            <span>Capacité</span>
          </div>
          <div className={styles.gauge}>
            <div className={styles.gaugeBar} style={{ '--val': '92%' }} />
            <span>Performance</span>
          </div>
        </div>
        <div className={styles.actions}>
          <Button to="/backoffice" variant="primary" size="lg" className={styles.cta}>
            Accès Backoffice
          </Button>
          <Button to="/frontoffice#repairs" variant="secondary" size="lg" className={styles.cta}>
            Voir réparations en cours
          </Button>
        </div>
      </section>

      <div className={styles.corner} data-corner="tl" />
      <div className={styles.corner} data-corner="tr" />
      <div className={styles.corner} data-corner="bl" />
      <div className={styles.corner} data-corner="br" />

      <div className={styles.hudStatus}>
        <span className={styles.statusDot} />
        <span>SYSTÈME ACTIF</span>
      </div>
    </div>
  );
}
