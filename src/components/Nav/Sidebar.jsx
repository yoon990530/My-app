import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/', icon: '🏠', label: '홈 피드' },
  { to: '/stock-news', icon: '📈', label: '주식 뉴스' },
  { to: '/anniversary', icon: '🎂', label: '기념일' },
];

export default function Sidebar() {
  const { user, logOut } = useAuth();

  const initial = user?.displayName?.[0]?.toUpperCase() || '?';

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>💙</span>
        <span className={styles.logoText}>우리만의 공간</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.profile}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>{user?.displayName}</p>
            <p className={styles.profileEmail}>{user?.email}</p>
          </div>
          <button className={styles.logoutBtn} onClick={logOut} title="로그아웃">
            나가기
          </button>
        </div>
      </div>
    </aside>
  );
}
