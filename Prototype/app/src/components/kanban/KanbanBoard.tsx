import { useState } from 'react'
import { Empty, Segmented, Typography } from 'antd'
import { hasPendingBadge, kanbanColumn } from '../../domain/kanban.ts'
import type { KanbanColumnId, ReadinessResult, WorkOrder } from '../../domain/types.ts'
import { useResponsive } from '../../hooks/useResponsive.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { KanbanColumn } from './KanbanColumn.tsx'
import { WorkOrderCard } from './WorkOrderCard.tsx'
import styles from './kanban.module.css'

const COLUMNS: { id: KanbanColumnId; title: string }[] = [
  { id: 'chua_phat', title: 'Chưa phát' },
  { id: 'da_phat', title: 'Đã phát' },
  { id: 'dang_chay', title: 'Đang chạy' },
  { id: 'tac', title: 'Tắc' },
  { id: 'xong', title: 'Xong' },
]

type FilterId = 'all' | 'ready' | 'pending' | 'stuck'

const FILTERS: { id: FilterId; label: string; short: string }[] = [
  { id: 'all', label: 'Tất cả', short: 'Tất cả' },
  { id: 'ready', label: 'Sẵn sàng', short: 'Sẵn' },
  { id: 'pending', label: 'Chờ duyệt', short: 'Chờ' },
  { id: 'stuck', label: 'Bị kẹt cổng', short: 'Kẹt' },
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
  const [mobileCol, setMobileCol] = useState<KanbanColumnId>('chua_phat')
  const { isDesktop, isMobile } = useResponsive()
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

  function itemsFor(columnId: KanbanColumnId): BoardRow[] {
    return visible
      .filter((row) => kanbanColumn(row.wo, row.pending) === columnId)
      .slice()
      .sort((a, b) => {
        if (a.pending !== b.pending) return a.pending ? -1 : 1
        return a.wo.wo_id.localeCompare(b.wo.wo_id, 'en', { numeric: true })
      })
  }

  function renderColumn(column: (typeof COLUMNS)[number]) {
    const items = itemsFor(column.id)
    return (
      <KanbanColumn key={column.id} columnId={column.id} title={column.title} count={items.length}>
        {items.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ height: 28 }} description="Không có lệnh" />
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
  }

  return (
    <div className={styles.boardWrap} data-filter={filter}>
      <div className={styles.toolbar}>
        <Segmented
          block={isMobile}
          value={filter}
          onChange={(value) => setFilter(value as FilterId)}
          options={FILTERS.map((item) => ({
            label: isMobile ? `${item.short} ${counts[item.id]}` : `${item.label} (${counts[item.id]})`,
            value: item.id,
          }))}
        />
        <Typography.Paragraph type="secondary" className={styles.hint}>
          Sẵn sàng: đủ cổng. Chờ duyệt: có phiếu đang mở. Bị kẹt cổng: chưa đủ cổng. Cờ LATE không đổi kết quả cổng.
          Phiếu chờ được đưa lên đầu cột.
        </Typography.Paragraph>
      </div>
      {isMobile ? (
        <div className={styles.mobileCol}>
          <Segmented
            block
            value={mobileCol}
            onChange={(value) => setMobileCol(value as KanbanColumnId)}
            options={COLUMNS.map((col) => ({
              label: `${col.title.replace('Chưa phát', 'Chưa').replace('Đã phát', 'Phát').replace('Đang chạy', 'Chạy')} ${itemsFor(col.id).length}`,
              value: col.id,
            }))}
            style={{ marginBottom: 8 }}
          />
          {renderColumn(COLUMNS.find((col) => col.id === mobileCol) ?? COLUMNS[0])}
        </div>
      ) : (
        <div
          className={`${styles.board} ${isDesktop ? styles.boardDesktop : styles.boardSnap}`}
          aria-label="Bảng Kanban năm cột"
        >
          {COLUMNS.map((column) => renderColumn(column))}
        </div>
      )}
    </div>
  )
}
