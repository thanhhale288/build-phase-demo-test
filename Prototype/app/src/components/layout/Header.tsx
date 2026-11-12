import { NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore.ts'
import { RoleSwitcher } from './RoleSwitcher.tsx'
import styles from './layout.module.css'

const LINKS = [
  { to: '/dispatcher', label: 'Điều độ' },
  { to: '/lead', label: 'Tổ trưởng' },
  { to: '/audit', label: 'Nhật ký' },
  { to: '/demo/stale-approve', label: 'Demo duyệt stale' },
]

export function Header() {
  const resetSeed = useAppStore((s) => s.resetSeed)
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        SmartWO — Điều độ lệnh <span className={styles.sim}>(mô phỏng)</span>
      </div>
      <nav className={styles.nav} aria-label="Chính">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.active}` : styles.navLink)}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.actions}>
        <RoleSwitcher />
        <button type="button" className={styles.reset} onClick={() => resetSeed()}>
          Reset Demo
        </button>
      </div>
    </header>
  )
}
