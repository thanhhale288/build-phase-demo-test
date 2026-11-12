import type { ReactNode } from 'react'
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
      <header className={styles.columnHead}>
        <h2 id={headingId}>{title}</h2>
        <span className={styles.count}>{count}</span>
      </header>
      <div className={styles.columnBody}>{children}</div>
    </section>
  )
}
