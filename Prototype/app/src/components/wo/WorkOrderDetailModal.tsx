import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { hasPendingBadge } from '../../domain/kanban.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { formatDue, stateLabel } from '../kanban/WorkOrderCard.tsx'
import { FiveGatesTable } from './FiveGatesTable.tsx'
import styles from './wo.module.css'

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
  const closeRef = useRef<HTMLButtonElement>(null)
  const workOrders = useAppStore((state) => state.workOrders)
  const hitlRequests = useAppStore((state) => state.hitlRequests)
  const getReadiness = useAppStore((state) => state.getReadiness)
  const wo = workOrders.find((item) => item.wo_id === woId)
  const readiness = wo ? getReadiness(wo.wo_id) : undefined
  const pending = wo ? hasPendingBadge(wo, hitlRequests) : false

  useEffect(() => {
    closeRef.current?.focus()
  }, [woId])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wo-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.dialogHead}>
          <div>
            <p className={styles.kicker}>Chi tiết lệnh sản xuất</p>
            <h2 id="wo-detail-title">
              {wo ? `${wo.wo_id} · ${wo.sku}` : woId}
            </h2>
          </div>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose}>
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
            Đóng
          </button>
        </header>

        {!wo || !readiness ? (
          <p className={styles.missing}>Không có lệnh {woId} trong dữ liệu mô phỏng.</p>
        ) : (
          <>
            {pending || readiness.late ? (
              <div className={styles.flags}>
                {pending ? <span className={styles.badgePending}>[Chờ duyệt]</span> : null}
                {readiness.late ? <span className={styles.flagLate}>[LATE]</span> : null}
              </div>
            ) : null}
            {pending ? (
              <p className={styles.pendingNote}>
                Có phiếu đang chờ. Trạng thái lệnh vẫn là {wo.state}.
              </p>
            ) : null}
            {readiness.late ? (
              <p className={styles.lateNote}>
                Cờ quá hạn tách với cổng sẵn sàng. Quá hạn vẫn phải đủ cổng mới được phát.
              </p>
            ) : null}
            <p
              className={
                readiness.overallReady
                  ? `${styles.summary} ${styles.summaryReady}`
                  : `${styles.summary} ${styles.summaryStuck}`
              }
            >
              <span
                className={
                  readiness.overallReady
                    ? `${styles.lamp} ${styles.lampPass}`
                    : `${styles.lamp} ${styles.lampFail}`
                }
                aria-hidden="true"
              />
              {readiness.overallReady ? 'Đủ cổng' : 'Chưa đủ cổng'}
            </p>
            <dl className={styles.meta}>
              <div>
                <dt>Trạng thái lệnh</dt>
                <dd>
                  {stateLabel(wo.state)}{' '}
                  <span className={styles.stateCode}>{wo.state}</span>
                </dd>
              </div>
              <div>
                <dt>Sản lượng</dt>
                <dd>
                  {wo.qty_good}/{wo.qty_target}
                </dd>
              </div>
              <div>
                <dt>Máy</dt>
                <dd>{wo.machine_id}</dd>
              </div>
              <div>
                <dt>Bản vẽ BOM</dt>
                <dd>{wo.bom_rev}</dd>
              </div>
              <div>
                <dt>Ca</dt>
                <dd>{wo.shift_id}</dd>
              </div>
              <div>
                <dt>Ưu tiên</dt>
                <dd>{PRIORITY_VI[wo.priority] ?? wo.priority}</dd>
              </div>
              <div>
                <dt>Hạn</dt>
                <dd>{formatDue(wo.due_time)}</dd>
              </div>
              <div>
                <dt>Lệnh tiền nhiệm</dt>
                <dd>{wo.predecessor_wo_id ? wo.predecessor_wo_id : 'Không có'}</dd>
              </div>
            </dl>
            <FiveGatesTable gates={readiness.gates} />
            {wo.note ? (
              <section className={styles.noteBlock}>
                <h3 className={styles.sectionTitle}>Ghi chú hiện trường</h3>
                <p className={styles.note}>{wo.note}</p>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
