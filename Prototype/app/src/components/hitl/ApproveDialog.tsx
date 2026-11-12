import styles from './hitl.module.css'

type Props = {
  title: string
  body: string
  onConfirm: () => void
  onClose: () => void
}

export function ApproveDialog({ title, body, onConfirm, onClose }: Props) {
  return (
    <div className={styles.dialogBack} onClick={onClose}>
      <div className={styles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{body}</p>
        <p className={styles.note}>Hệ thống sẽ kiểm tra lại 5 cổng trước khi ghi. Giữ chỗ vật tư lúc duyệt: quyết định nhóm đang chờ chốt.</p>
        <div className={styles.row}>
          <button type="button" className={`${styles.btn} ${styles.approve}`} onClick={onConfirm}>Xác nhận duyệt</button>
          <button type="button" className={styles.btn} onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  )
}
