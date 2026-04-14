import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string;
  onLogout?: () => void;
}

function initials(name?: string) {
  if (!name?.trim()) return '?';
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Header({ title, onMenuClick, userName, onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button type="button" className={styles.menuBtn} onClick={onMenuClick}>
          ☰
        </button>
        <h1 className={styles.logo}>{title}</h1>
      </div>
      <div className={styles.right}>
        {onLogout && (
          <button type="button" className={styles.logoutBtn} onClick={onLogout}>
            Déconnexion
          </button>
        )}
        <span className={styles.avatar}>{initials(userName)}</span>
      </div>
    </header>
  );
}
