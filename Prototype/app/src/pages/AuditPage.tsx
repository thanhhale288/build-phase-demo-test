import { EventRow } from '../components/audit/EventRow.tsx'
import styles from '../components/audit/audit.module.css'
import { useAppStore } from '../store/useAppStore.ts'

export function AuditPage() {
  const events = useAppStore((s) => s.events)
  const rows = [...events].sort((a, b) => (a.ts < b.ts ? 1 : -1))
  return (
    <main className={`app-main ${styles.page}`}>
      <h1>Nhật ký thao tác</h1>
      <p className={styles.lede}>Giờ hiển thị theo Asia/Saigon. Dữ liệu mô phỏng.</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Thời điểm</th>
            <th>Lệnh</th>
            <th>Người</th>
            <th>Vai</th>
            <th>Sự kiện</th>
            <th>Từ</th>
            <th>Sang</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((event) => (
            <EventRow key={event.id} event={event} />
          ))}
        </tbody>
      </table>
    </main>
  )
}
