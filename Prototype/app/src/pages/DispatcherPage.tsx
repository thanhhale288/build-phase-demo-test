import { useNavigate, useParams } from 'react-router-dom'
import { AgentMount } from '../components/agent/AgentMount.tsx'
import { KanbanBoard } from '../components/kanban/KanbanBoard.tsx'
import styles from '../components/kanban/kanban.module.css'
import { HitlPanel } from '../components/hitl/HitlPanel.tsx'
import { WorkOrderDetailModal } from '../components/wo/WorkOrderDetailModal.tsx'
import { useAppStore } from '../store/useAppStore.ts'

export function DispatcherPage() {
  const { woId } = useParams()
  const navigate = useNavigate()
  const role = useAppStore((state) => state.role)

  return (
    <main className={`app-main ${styles.page}`} data-role={role}>
      <header className={styles.pageHead} aria-hidden={woId ? true : undefined}>
        <h1>Điều độ lệnh sản xuất</h1>
        <p className={styles.lede}>
          Năm cột theo trạng thái lệnh. Phiếu chờ duyệt và cờ quá hạn hiện trên thẻ, không thành cột. Số trên cổng lấy từ kết quả kiểm tra. Dữ liệu mô phỏng.
        </p>
      </header>
      <div className={styles.workspace} aria-hidden={woId ? true : undefined}>
        <KanbanBoard
          activeWoId={woId}
          onSelect={(id) => {
            navigate(`/wo/${id}`)
          }}
        />
        <aside className={styles.rail} aria-label="Phiếu duyệt và trợ lý">
          <div id="smartwo-hitl-slot">
            <HitlPanel />
          </div>
          <div id="smartwo-agent-slot">
            <AgentMount woId={woId ?? 'WO-02'} />
          </div>
        </aside>
      </div>
      {woId ? (
        <WorkOrderDetailModal woId={woId} onClose={() => navigate('/dispatcher')} />
      ) : null}
    </main>
  )
}
