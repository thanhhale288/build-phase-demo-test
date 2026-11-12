import { Card, Col, Row, Statistic, Tabs, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { AgentMount } from '../components/agent/AgentMount.tsx'
import { HitlPanel } from '../components/hitl/HitlPanel.tsx'
import { KanbanBoard } from '../components/kanban/KanbanBoard.tsx'
import styles from '../components/kanban/kanban.module.css'
import { WorkOrderDetailModal } from '../components/wo/WorkOrderDetailModal.tsx'
import { hasPendingBadge } from '../domain/kanban.ts'
import { useResponsive } from '../hooks/useResponsive.ts'
import { useAppStore } from '../store/useAppStore.ts'

export function DispatcherPage() {
  const { woId } = useParams()
  const navigate = useNavigate()
  const { isDesktop } = useResponsive()
  const role = useAppStore((state) => state.role)
  const workOrders = useAppStore((state) => state.workOrders)
  const hitlRequests = useAppStore((state) => state.hitlRequests)
  const machines = useAppStore((state) => state.machines)
  const getReadiness = useAppStore((state) => state.getReadiness)

  const total = workOrders.length
  const ready = workOrders.filter((wo) => getReadiness(wo.wo_id).overallReady).length
  const pending = hitlRequests.filter((req) => req.status === 'pending').length
  const machineAlerts = machines.filter((m) => m.status === 'DOWN' || m.status === 'MAINTENANCE').length
  const running = workOrders.filter((wo) => wo.state === 'in_progress').length
  const blocked = workOrders.filter((wo) => wo.state === 'blocked').length
  const pendingBadgeCount = workOrders.filter((wo) => hasPendingBadge(wo, hitlRequests)).length

  const stats = [
    { title: 'Tổng lệnh', value: total },
    { title: 'Đủ cổng', value: ready },
    { title: 'Phiếu chờ duyệt', value: pending },
    { title: 'Máy dừng / bảo trì', value: machineAlerts },
    { title: 'Đang chạy', value: running },
    { title: 'Tắc', value: blocked },
  ]

  const rail = (
    <>
      <div id="smartwo-hitl-slot">
        <HitlPanel />
      </div>
      <div id="smartwo-agent-slot">
        <AgentMount woId={woId ?? 'WO-02'} />
      </div>
    </>
  )

  return (
    <div data-role={role}>
      <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
        Điều độ lệnh sản xuất
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Năm cột theo trạng thái lệnh. Phiếu chờ duyệt và cờ quá hạn hiện trên thẻ, không thành cột.
        Số trên cổng lấy từ kết quả kiểm tra. Dữ liệu mô phỏng.
        {pendingBadgeCount > 0 ? ` Đang có ${pendingBadgeCount} lệnh mang badge chờ duyệt.` : ''}
      </Typography.Paragraph>
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        {stats.map((item) => (
          <Col xs={12} md={6} lg={4} key={item.title}>
            <Card size="small">
              <Statistic title={item.title} value={item.value} />
            </Card>
          </Col>
        ))}
      </Row>
      {isDesktop ? (
        <div className={styles.workspace}>
          <KanbanBoard
            activeWoId={woId}
            onSelect={(id) => {
              navigate(`/wo/${id}`)
            }}
          />
          <aside className={styles.rail} aria-label="Phiếu duyệt và trợ lý">
            {rail}
          </aside>
        </div>
      ) : (
        <>
          <KanbanBoard
            activeWoId={woId}
            onSelect={(id) => {
              navigate(`/wo/${id}`)
            }}
          />
          <Tabs
            style={{ marginTop: 16 }}
            items={[
              { key: 'hitl', label: `Phiếu chờ duyệt (${pending})`, children: <div id="smartwo-hitl-slot"><HitlPanel /></div> },
              { key: 'agent', label: 'Trợ lý điều độ', children: <div id="smartwo-agent-slot"><AgentMount woId={woId ?? 'WO-02'} /></div> },
            ]}
          />
        </>
      )}
      {woId ? <WorkOrderDetailModal woId={woId} onClose={() => navigate('/dispatcher')} /> : null}
    </div>
  )
}
