import { NavLink } from 'react-router-dom';
import styles from './BottomTab.module.css';

const TABS = [
  { to: '/', icon: '🏠', label: '홈' },
  { to: '/chat', icon: '💬', label: '채팅' },
  { to: '/anniversary', icon: '🎂', label: '기념일' },
];

export default function BottomTab() {
  return (
    <nav className={styles.tabBar}>
      {TABS.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `${styles.tabItem} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.tabIcon}>{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
