import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HitlRequestCard } from '../components/hitl/HitlRequestCard.tsx'
import styles from '../components/hitl/hitl.module.css'
import { useAppStore } from '../store/useAppStore.ts'

export function DemoStalePage() {
  const hitlRequests = useAppStore((s) => s.hitlRequests)
  const getReadiness = useAppStore((s) => s.getReadiness)
  const simulateStale = useAppStore((s) => s.simulateStale)
  const workOrders = useAppStore((s) => s.workOrders)
  const [msg, setMsg] = useState<string | null>(null)
  const ticket = hitlRequests.find((req) => req.id === 'HITL-09') ?? hitlRequests.find((req) => req.wo_id === 'WO-09')
  const wo = workOrders.find((item) => item.wo_id === 'WO-09')
  const readiness = getReadiness('WO-09')

  return (
    <main className={`app-main ${styles.page}`}>
      <h1>Demo duyệt khi dữ liệu đã đổi</h1>
      <p className={styles.lede}>
        WO-09 bắt đầu đủ cổng và có phiếu RELEASE chờ duyệt. Bấm giả lập xuất kho bu-lông, rồi Duyệt — hệ thống phải từ chối, lệnh vẫn created, không tăng giữ chỗ. Dùng Reset Demo trên header để chạy lại.
      </p>
      <p>
        Trạng thái lệnh: <strong>{wo?.state}</strong>. Đủ cổng: {readiness.overallReady ? 'có' : 'không'}.
      </p>
      <div className={styles.row}>
        <button type="button" className={styles.btn} onClick={() => setMsg(simulateStale().message)}>
          Giả lập xuất kho đột xuất bu-lông BLT-1
        </button>
        <Link to="/dispatcher">Về bảng điều độ</Link>
      </div>
      {msg ? <p className={styles.msg}>{msg}</p> : null}
      {ticket ? <HitlRequestCard request={ticket} /> : <p>Không còn phiếu HITL-09. Hãy bấm Reset Demo.</p>}
    </main>
  )
}
