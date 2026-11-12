import { useAppStore } from '../../store/useAppStore.ts'
import { HitlRequestCard } from './HitlRequestCard.tsx'
import styles from './hitl.module.css'

export function HitlPanel() {
  const hitlRequests = useAppStore((s) => s.hitlRequests)
  const pending = hitlRequests.filter((req) => req.status === 'pending')
  return (
    <section className={styles.panel} aria-label="Phiếu chờ duyệt">
      <h2 className={styles.title}>Phiếu chờ duyệt</h2>
      {pending.length === 0 ? <p className={styles.note}>Không có phiếu đang mở.</p> : null}
      {pending.map((req) => (
        <HitlRequestCard key={req.id} request={req} />
      ))}
      <p className={styles.note}>Giữ chỗ vật tư lúc duyệt thành công: quyết định nhóm đang chờ chốt.</p>
    </section>
  )
}
