import type { GateId, GateResult, ReadinessResult, WorkOrder } from '../../domain/types.ts'
import styles from './kanban.module.css'

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

function dotClass(gate: GateResult | undefined): string {
  if (!gate) return styles.dot
  if (gate.notApplicable) return `${styles.dot} ${styles.dotNa}`
  if (gate.pass) return `${styles.dot} ${styles.dotPass}`
  return `${styles.dot} ${styles.dotFail}`
}

function dotStatus(gate: GateResult | undefined): string {
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
  const stuckTitle = stuck
    ? GATE_ORDER.find((spec) => spec.id === stuck.id)?.title
    : undefined

  return (
    <button
      type="button"
      className={active ? `${styles.card} ${styles.cardActive}` : styles.card}
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      aria-haspopup="dialog"
      data-wo-id={wo.wo_id}
      data-state={wo.state}
      data-ready={readiness.overallReady ? 'true' : 'false'}
      data-late={readiness.late ? 'true' : 'false'}
      data-pending={pending ? 'true' : 'false'}
    >
      <span className={styles.cardTop}>
        <span className={styles.woId}>{wo.wo_id}</span>
        <span className={styles.stateCode}>{wo.state}</span>
      </span>
      <span className={styles.metaLine}>
        {wo.sku} · SL {wo.qty_good}/{wo.qty_target} · {wo.machine_id}
      </span>
      <span className={styles.dueLine}>
        Hạn {formatDue(wo.due_time)}
      </span>
      {pending || readiness.late ? (
        <span className={styles.flags}>
          {pending ? <span className={styles.badgePending}>[Chờ duyệt]</span> : null}
          {readiness.late ? (
            <span className={styles.flagLate} title="Quá hạn. Tách với kết quả cổng.">
              [LATE]
            </span>
          ) : null}
        </span>
      ) : null}
      <span className={styles.dots} aria-hidden="true">
        {GATE_ORDER.map((spec) => {
          const gate = gateOf(readiness.gates, spec.id)
          return (
            <span
              key={spec.id}
              className={dotClass(gate)}
              title={`${spec.title}: ${dotStatus(gate)}`}
            />
          )
        })}
      </span>
      <span className={styles.srOnly}>
        {GATE_ORDER.map((spec) => {
          const gate = gateOf(readiness.gates, spec.id)
          return `${spec.title} ${dotStatus(gate)}`
        }).join('. ')}
      </span>
      {stuckTitle ? <span className={styles.stuckLine}>Bị kẹt cổng: {stuckTitle}</span> : null}
    </button>
  )
}
