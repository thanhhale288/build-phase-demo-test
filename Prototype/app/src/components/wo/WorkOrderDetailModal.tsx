import { Alert, Descriptions, Drawer, Empty, Space, Tag, Typography } from 'antd'
import { hasPendingBadge } from '../../domain/kanban.ts'
import { useResponsive } from '../../hooks/useResponsive.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { formatDue, stateLabel } from '../kanban/WorkOrderCard.tsx'
import { FiveGatesTable } from './FiveGatesTable.tsx'

const PRIORITY_VI: Record<string, string> = {
  LOW: 'Thấp',
  NORMAL: 'Bình thường',
  HIGH: 'Cao',
  URGENT: 'Khẩn',
}

type WorkOrderDetailModalProps = {
  woId: string
  onClose: () => void
}

export function WorkOrderDetailModal({ woId, onClose }: WorkOrderDetailModalProps) {
  const { screens } = useResponsive()
  const workOrders = useAppStore((state) => state.workOrders)
  const hitlRequests = useAppStore((state) => state.hitlRequests)
  const getReadiness = useAppStore((state) => state.getReadiness)
  const wo = workOrders.find((item) => item.wo_id === woId)
  const readiness = getReadiness(woId)
  const pending = wo ? hasPendingBadge(wo, hitlRequests) : false

  return (
    <Drawer
      title={wo ? `${wo.wo_id} · ${wo.sku}` : woId}
      open
      onClose={onClose}
      width={screens.md ? 640 : '100%'}
      destroyOnHidden
    >
      {!wo ? (
        <Empty description={`Không tìm thấy lệnh ${woId} trong dữ liệu mô phỏng.`} />
      ) : (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {pending ? (
            <Space wrap>
              <Tag color="gold">[Chờ duyệt]</Tag>
              <Typography.Text>
                Có phiếu đang chờ. Trạng thái lệnh vẫn là {wo.state}.
              </Typography.Text>
            </Space>
          ) : null}
          <Alert
            type={readiness.overallReady ? 'success' : 'error'}
            showIcon
            message={readiness.overallReady ? 'Đủ cổng' : 'Chưa đủ cổng'}
          />
          <Descriptions
            size="small"
            bordered
            column={screens.md ? 2 : 1}
            items={[
              { key: 'state', label: 'Trạng thái lệnh', children: `${stateLabel(wo.state)} (${wo.state})` },
              { key: 'qty', label: 'Sản lượng', children: `${wo.qty_good}/${wo.qty_target}` },
              { key: 'machine', label: 'Máy', children: wo.machine_id },
              { key: 'bom', label: 'Bản vẽ BOM', children: wo.bom_rev },
              { key: 'shift', label: 'Ca', children: wo.shift_id },
              { key: 'priority', label: 'Ưu tiên', children: PRIORITY_VI[wo.priority] ?? wo.priority },
              { key: 'due', label: 'Hạn', children: formatDue(wo.due_time) },
              { key: 'pred', label: 'Lệnh liên trước', children: wo.predecessor_wo_id ?? 'Không có' },
            ]}
          />
          <FiveGatesTable gates={readiness.gates} />
        </Space>
      )}
    </Drawer>
  )
}
