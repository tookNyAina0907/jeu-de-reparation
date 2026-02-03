import { useState, useEffect } from 'react';
import styles from './ProgressBar.module.scss';

export function ProgressBar({ value = 0, max = 100, label, showPercent = true, animated = true }) {
  const [displayValue, setDisplayValue] = useState(0);
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  useEffect(() => {
    if (!animated) {
      setDisplayValue(percent);
      return;
    }
    const timer = setTimeout(() => setDisplayValue(percent), 100);
    return () => clearTimeout(timer);
  }, [percent, animated]);

  return (
    <div className={styles.wrapper}>
      {(label || showPercent) && (
        <div className={styles.top}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercent && <span className={styles.percent}>{Math.round(displayValue)}%</span>}
        </div>
      )}
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${displayValue}%` }}
          role="progressbar"
          aria-valuenow={displayValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
