import { useState } from 'react'
import type { HitlRequest } from '../../domain/types.ts'
import { useAppStore } from '../../store/useAppStore.ts'
import { ApproveDialog } from './ApproveDialog.tsx'
import { RejectDialog } from './RejectDialog.tsx'
import styles from './hitl.module.css'

export function HitlRequestCard({ request }: { request: HitlRequest }) {
  const role = useAppStore((s) => s.role)
  const workOrders = useAppStore((s) => s.workOrders)
  const approveHitl = useAppStore((s) => s.approveHitl)
  const rejectHitl = useAppStore((s) => s.rejectHitl)
  const [open, setOpen] = useState<'approve' | 'reject' | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const wo = workOrders.find((item) => item.wo_id === request.wo_id)

  if (role !== 'dispatcher' && request.status === 'pending') {
    return (
      <article className={styles.card}>
        <strong>{request.id}</strong> · {request.action} · {request.wo_id}
        <p className={styles.meta}>Tổ trưởng không duyệt / từ chối phiếu.</p>
      </article>
    )
  }

  return (
    <article className={styles.card}>
      <strong>{request.id}</strong> · {request.action} · {request.wo_id} · {request.status}
      <p className={styles.meta}>
        Lệnh hiện {wo?.state ?? '—'}. Phiếu từ trạng thái {request.from_state}. {request.reason}
      </p>
      {request.status === 'pending' ? (
        <div className={styles.row}>
          <button type="button" className={`${styles.btn} ${styles.approve}`} onClick={() => setOpen('approve')}>
            Duyệt
          </button>
          <button type="button" className={`${styles.btn} ${styles.reject}`} onClick={() => setOpen('reject')}>
            Từ chối
          </button>
        </div>
      ) : null}
      {msg ? <p className={`${styles.msg} ${msg.ok ? styles.ok : styles.fail}`}>{msg.text}</p> : null}
      {open === 'approve' ? (
        <ApproveDialog
          title={`Duyệt ${request.action} cho ${request.wo_id}?`}
          body="Điều độ viên xác nhận. Hệ thống sẽ re-check cổng. Nếu dữ liệu đã đổi, lệnh không được phát."
          onClose={() => setOpen(null)}
          onConfirm={() => {
            const result = approveHitl(request.id)
            setMsg({ ok: result.ok, text: result.message })
            setOpen(null)
          }}
        />
      ) : null}
      {open === 'reject' ? (
        <RejectDialog
          title={`Từ chối phiếu ${request.id}?`}
          body={
            request.action === 'CANCEL'
              ? `Từ chối phiếu hủy thì lệnh ${request.wo_id} giữ nguyên trạng thái hiện tại (${wo?.state ?? request.from_state}), không tụt về kế hoạch.`
              : `Từ chối phiếu phát thì lệnh ${request.wo_id} vẫn ở ${wo?.state ?? request.from_state}.`
          }
          onClose={() => setOpen(null)}
          onConfirm={() => {
            const result = rejectHitl(request.id)
            setMsg({ ok: result.ok, text: result.message })
            setOpen(null)
          }}
        />
      ) : null}
    </article>
  )
}
