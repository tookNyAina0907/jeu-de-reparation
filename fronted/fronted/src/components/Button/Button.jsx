import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

export function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}) {
  const classes = [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ');

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
