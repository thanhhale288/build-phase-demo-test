import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore.ts'
import styles from './lead.module.css'

const VISIBLE = new Set(['released', 'in_progress', 'blocked'])

export function LeadControlPanel() {
  const role = useAppStore((s) => s.role)
  const workOrders = useAppStore((s) => s.workOrders)
  const startOrder = useAppStore((s) => s.startOrder)
  const reportProgress = useAppStore((s) => s.reportProgress)
  const blockOrder = useAppStore((s) => s.blockOrder)
  const [qty, setQty] = useState<Record<string, string>>({})
  const [reason, setReason] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<Record<string, string>>({})

  if (role !== 'line_lead') {
    return (
      <div className={styles.denied}>
        <p>Đang ở vai Điều độ viên, nên các nút Start / sản lượng / Báo tắc bị ẩn.</p>
        <button type="button" className={styles.btn} onClick={() => useAppStore.getState().setRole('line_lead')}>
          Chuyển sang vai Tổ trưởng chuyền
        </button>
      </div>
    )
  }

  const orders = workOrders.filter((wo) => VISIBLE.has(wo.state))

  return (
    <div className={styles.list}>
      {orders.map((wo) => (
        <article key={wo.wo_id} className={styles.card}>
          <strong>{wo.wo_id}</strong> · {wo.sku} · {wo.state} · {wo.qty_good}/{wo.qty_target} · {wo.machine_id}
          <div className={styles.row}>
            {wo.state === 'released' ? (
              <button type="button" className={styles.btn} onClick={() => setMsg((m) => ({ ...m, [wo.wo_id]: startOrder(wo.wo_id).message }))}>
                Bắt đầu
              </button>
            ) : null}
            {wo.state === 'in_progress' ? (
              <>
                <label>
                  Sản lượng
                  <input
                    className={styles.input}
                    type="number"
                    min={wo.qty_good}
                    value={qty[wo.wo_id] ?? String(wo.qty_target)}
                    onChange={(e) => setQty((s) => ({ ...s, [wo.wo_id]: e.target.value }))}
                  />
                </label>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => {
                    const n = Number(qty[wo.wo_id] ?? wo.qty_target)
                    setMsg((m) => ({ ...m, [wo.wo_id]: reportProgress(wo.wo_id, n).message }))
                  }}
                >
                  Ghi sản lượng
                </button>
              </>
            ) : null}
            {wo.state === 'released' || wo.state === 'in_progress' ? (
              <>
                <input
                  className={styles.input}
                  style={{ width: 220 }}
                  placeholder="Lý do tắc"
                  value={reason[wo.wo_id] ?? ''}
                  onChange={(e) => setReason((s) => ({ ...s, [wo.wo_id]: e.target.value }))}
                />
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => setMsg((m) => ({ ...m, [wo.wo_id]: blockOrder(wo.wo_id, reason[wo.wo_id] || 'Sự cố trên chuyền (mô phỏng)').message }))}
                >
                  Báo tắc
                </button>
              </>
            ) : null}
          </div>
          {msg[wo.wo_id] ? <p className={styles.msg}>{msg[wo.wo_id]}</p> : null}
        </article>
      ))}
    </div>
  )
}
