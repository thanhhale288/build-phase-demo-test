import { useState } from 'react'
import { hasPendingBadge, kanbanColumn } from '../../domain/kanban.ts'
import type { ReadinessResult, WorkOrder } from '../../domain/types.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { KanbanColumn } from './KanbanColumn.tsx'
import { WorkOrderCard } from './WorkOrderCard.tsx'
import styles from './kanban.module.css'

const COLUMNS = [
  { id: 'chua_phat', title: 'Chưa phát' },
  { id: 'da_phat', title: 'Đã phát' },
  { id: 'dang_chay', title: 'Đang chạy' },
  { id: 'tac', title: 'Tắc' },
  { id: 'xong', title: 'Xong' },
] as const

type FilterId = 'all' | 'ready' | 'pending' | 'stuck'

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'ready', label: 'Sẵn sàng' },
  { id: 'pending', label: 'Chờ duyệt' },
  { id: 'stuck', label: 'Bị kẹt cổng' },
]

type BoardRow = {
  wo: WorkOrder
  readiness: ReadinessResult
  pending: boolean
}

function matches(row: Pick<BoardRow, 'readiness' | 'pending'>, filter: FilterId): boolean {
  if (filter === 'ready') return row.readiness.overallReady
  if (filter === 'pending') return row.pending
  if (filter === 'stuck') return !row.readiness.overallReady
  return true
}

type KanbanBoardProps = {
  activeWoId?: string
  onSelect: (woId: string) => void
}

export function KanbanBoard({ activeWoId, onSelect }: KanbanBoardProps) {
  const [filter, setFilter] = useState<FilterId>('all')
  const workOrders = useAppStore((state) => state.workOrders)
  const hitlRequests = useAppStore((state) => state.hitlRequests)
  const getReadiness = useAppStore((state) => state.getReadiness)

  const rows: BoardRow[] = workOrders.map((wo) => ({
    wo,
    readiness: getReadiness(wo.wo_id),
    pending: hasPendingBadge(wo, hitlRequests),
  }))

  const counts: Record<FilterId, number> = {
    all: rows.length,
    ready: rows.filter((row) => row.readiness.overallReady).length,
    pending: rows.filter((row) => row.pending).length,
    stuck: rows.filter((row) => !row.readiness.overallReady).length,
  }

  const visible = rows.filter((row) => matches(row, filter))

  return (
    <div data-filter={filter}>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Lọc lệnh trên bảng">
          {FILTERS.map((item) => {
            const selected = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={selected ? `${styles.filter} ${styles.filterOn}` : styles.filter}
                aria-pressed={selected}
                onClick={() => setFilter(item.id)}
              >
                {item.label} <span className={styles.filterCount}>({counts[item.id]})</span>
              </button>
            )
          })}
        </div>
        <p className={styles.hint}>
          Sẵn sàng: đủ cổng. Chờ duyệt: có phiếu đang mở. Bị kẹt cổng: chưa đủ cổng. Cờ LATE không đổi kết quả cổng.
        </p>
      </div>
      <div className={styles.board} aria-label="Bảng Kanban năm cột">
        {COLUMNS.map((column) => {
          const items = visible
            .filter((row) => kanbanColumn(row.wo, row.pending) === column.id)
            .slice()
            .sort((a, b) => a.wo.wo_id.localeCompare(b.wo.wo_id, 'en', { numeric: true }))

          return (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              count={items.length}
            >
              {items.length === 0 ? (
                <p className={styles.empty}>Không có lệnh</p>
              ) : (
                items.map((row) => (
                  <WorkOrderCard
                    key={row.wo.wo_id}
                    wo={row.wo}
                    readiness={row.readiness}
                    pending={row.pending}
                    active={activeWoId === row.wo.wo_id}
                    onSelect={() => onSelect(row.wo.wo_id)}
                  />
                ))
              )}
            </KanbanColumn>
          )
        })}
      </div>
    </div>
  )
}
