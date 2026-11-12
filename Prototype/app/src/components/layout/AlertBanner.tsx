import { useAppStore } from '../../store/useAppStore.ts'
import styles from './layout.module.css'

export function AlertBanner() {
  const machines = useAppStore((s) => s.machines)
  const workOrders = useAppStore((s) => s.workOrders)
  const alerts = machines.filter((m) => m.status === 'DOWN' || m.status === 'MAINTENANCE')
  if (alerts.length === 0) return null
  return (
    <div className={styles.banner} role="status">
      {alerts.map((machine) => {
        const affected = workOrders.filter((wo) => wo.machine_id === machine.machine_id)
        const statusVi = machine.status === 'DOWN' ? 'dừng (DOWN)' : 'bảo trì (MAINTENANCE)'
        return (
          <div key={machine.machine_id}>
            <strong>Máy {machine.machine_id} — {machine.name}</strong> đang {statusVi}. Không đề xuất đổi máy.
            {affected.length > 0 ? (
              <ul className={styles.bannerList}>
                {affected.map((wo) => (
                  <li key={wo.wo_id}>
                    Lệnh bị ảnh hưởng: {wo.wo_id} ({wo.state})
                  </li>
                ))}
              </ul>
            ) : (
              <div>Không có lệnh đang gán máy này trong seed hiện tại.</div>
            )}
          </div>
        )
      })}
    </div>
  )
}
