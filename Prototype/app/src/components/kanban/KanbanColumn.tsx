import type { ReactNode } from 'react'
import { Badge, Card } from 'antd'
import styles from './kanban.module.css'

type KanbanColumnProps = {
  columnId: string
  title: string
  count: number
  children: ReactNode
}

export function KanbanColumn({ columnId, title, count, children }: KanbanColumnProps) {
  const headingId = `kanban-col-${columnId}`
  return (
    <section className={styles.column} aria-labelledby={headingId} data-column={columnId}>
      <Card
        size="small"
        title={
          <span id={headingId}>
            {title} <Badge count={count} showZero color="#1668DC" style={{ marginLeft: 6 }} />
          </span>
        }
        styles={{ body: { padding: 8 }, header: { minHeight: 40, padding: '0 12px' } }}
      >
        <div className={styles.columnBody}>{children}</div>
      </Card>
    </section>
  )
}
