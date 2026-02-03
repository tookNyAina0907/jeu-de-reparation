import styles from './Card.module.scss';

export function Card({ children, className = '', variant = 'default' }) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className={styles.header}>
      <div>
        {title && <h3 className={styles.title}>{title}</h3>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
