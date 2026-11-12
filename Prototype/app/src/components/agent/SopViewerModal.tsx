import type { SopDocument } from '../../domain/types.ts'
import styles from './agent.module.css'

export function SopViewerModal({ sop, onClose }: { sop: SopDocument; onClose: () => void }) {
  return (
    <div className={styles.modalBack} onClick={onClose}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="sop-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="sop-title">{sop.sop_id} — {sop.title}</h2>
        <p>Nhóm: {sop.category} · Áp dụng: {sop.target_sku_or_process} · Bản {sop.effective_rev}</p>
        <p>{sop.excerpt}</p>
        <button type="button" className={styles.btn} onClick={onClose}>Đóng</button>
      </div>
    </div>
  )
}
