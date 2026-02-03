import { Link, NavLink } from 'react-router-dom';
import styles from './Layout.module.scss';

export function Layout({ children, showNav = true }) {
  return (
    <div className={styles.wrapper}>
      {showNav && (
        <header className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚙</span>
            <span>GARAGE SIMULATION</span>
          </Link>
          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : '')}>
              Accueil
            </NavLink>
            <NavLink to="/backoffice" className={({ isActive }) => (isActive ? styles.active : '')}>
              Backoffice
            </NavLink>
            <NavLink to="/frontoffice" className={({ isActive }) => (isActive ? styles.active : '')}>
              FrontOffice
            </NavLink>
          </nav>
        </header>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
}
