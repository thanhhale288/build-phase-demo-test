import { useAppStore } from '../../store/useAppStore.ts'
import styles from './layout.module.css'

export function RoleSwitcher() {
  const role = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)
  return (
    <div className={styles.role} role="group" aria-label="Chuyển vai">
      <button type="button" className={role === 'dispatcher' ? styles.on : undefined} onClick={() => setRole('dispatcher')}>
        Điều độ viên
      </button>
      <button type="button" className={role === 'line_lead' ? styles.on : undefined} onClick={() => setRole('line_lead')}>
        Tổ trưởng chuyền
      </button>
    </div>
  )
}
