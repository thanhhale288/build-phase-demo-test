import { Card, Progress, Space, Tag, Tooltip, Typography } from 'antd'
import type { GateId, GateResult, ReadinessResult, WorkOrder } from '../../domain/types.ts'

const GATE_ORDER: { id: GateId; title: string }[] = [
  { id: 'material', title: 'Vật tư' },
  { id: 'machine', title: 'Máy' },
  { id: 'labor', title: 'Nhân lực' },
  { id: 'bom_rev', title: 'Bản vẽ BOM' },
  { id: 'predecessor', title: 'Công đoạn trước' },
]

const STATE_VI: Record<string, string> = {
  created: 'Chưa phát',
  not_ready: 'Chưa phát',
  released: 'Đã phát',
  in_progress: 'Đang chạy',
  blocked: 'Tắc',
  done: 'Xong',
  cancelled: 'Đã hủy',
}

const STATE_COLOR: Record<string, string> = {
  created: 'default',
  not_ready: 'default',
  released: 'blue',
  in_progress: 'processing',
  blocked: 'error',
  done: 'success',
  cancelled: 'default',
}

export function stateLabel(state: string): string {
  return STATE_VI[state] ?? state
}

export function formatDue(value: WorkOrder['due_time']): string {
  if (value == null) return '—'
  if (typeof value === 'string' && value.trim() === '') return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '—'
  }
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function gateOf(gates: GateResult[], id: GateId): GateResult | undefined {
  return gates.find((gate) => gate.id === id)
}

function gateStatus(gate: GateResult | undefined): string {
  if (!gate) return 'Chưa có số liệu'
  if (gate.notApplicable) return 'Không áp dụng'
  return gate.pass ? 'Đạt' : 'Không đạt'
}

type WorkOrderCardProps = {
  wo: WorkOrder
  readiness: ReadinessResult
  pending: boolean
  active: boolean
  onSelect: () => void
}

export function WorkOrderCard({ wo, readiness, pending, active, onSelect }: WorkOrderCardProps) {
  const stuck = GATE_ORDER.map((spec) => gateOf(readiness.gates, spec.id)).find(
    (gate) => gate != null && !gate.pass && !gate.notApplicable,
  )
  const stuckTitle = stuck ? GATE_ORDER.find((spec) => spec.id === stuck.id)?.title : undefined
  const percent = wo.qty_target > 0 ? Math.round((wo.qty_good / wo.qty_target) * 100) : 0

  return (
    <Card
      size="small"
      hoverable
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      data-wo-id={wo.wo_id}
      data-state={wo.state}
      data-ready={readiness.overallReady ? 'true' : 'false'}
      data-late={readiness.late ? 'true' : 'false'}
      data-pending={pending ? 'true' : 'false'}
      style={{
        borderColor: active ? '#1668DC' : undefined,
        boxShadow: active ? '0 0 0 1px #1668DC' : undefined,
        cursor: 'pointer',
      }}
      styles={{ body: { padding: 10 } }}
    >
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Text strong>{wo.wo_id}</Typography.Text>
        <Tag style={{ marginInlineEnd: 0 }} color={STATE_COLOR[wo.state]}>
          {wo.state}
        </Tag>
      </Space>
      <Typography.Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
        {wo.sku} · {wo.machine_id} · Hạn {formatDue(wo.due_time)}
      </Typography.Text>
      <Typography.Text type="secondary" style={{ display: 'block', marginTop: 6 }}>
        SL {wo.qty_good}/{wo.qty_target}
      </Typography.Text>
      <Progress
        percent={percent}
        size="small"
        showInfo={false}
        style={{ margin: '4px 0 6px' }}
      />
      <Space size={4} wrap>
        {pending ? <Tag color="gold">[Chờ duyệt]</Tag> : null}
        {readiness.late ? <Tag color="red">[LATE]</Tag> : null}
        {GATE_ORDER.map((spec) => {
          const gate = gateOf(readiness.gates, spec.id)
          const color = !gate || gate.notApplicable ? 'default' : gate.pass ? 'success' : 'error'
          const mark = !gate || gate.notApplicable ? '—' : gate.pass ? '●' : '●'
          return (
            <Tooltip key={spec.id} title={`${spec.title}: ${gateStatus(gate)}`}>
              <Tag color={color} style={{ marginInlineEnd: 0, minWidth: 22, textAlign: 'center' }}>
                {mark}
              </Tag>
            </Tooltip>
          )
        })}
      </Space>
      {stuckTitle ? (
        <Typography.Text type="danger" style={{ display: 'block', marginTop: 6, fontSize: 12 }}>
          Bị kẹt cổng: {stuckTitle}
        </Typography.Text>
      ) : null}
    </Card>
  )
}
