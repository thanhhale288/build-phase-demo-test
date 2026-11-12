import styles from './hitl.module.css'

type Props = {
  title: string
  body: string
  onConfirm: () => void
  onClose: () => void
}

export function RejectDialog({ title, body, onConfirm, onClose }: Props) {
  return (
    <div className={styles.dialogBack} onClick={onClose}>
      <div className={styles.dialog} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{body}</p>
        <div className={styles.row}>
          <button type="button" className={`${styles.btn} ${styles.reject}`} onClick={onConfirm}>Xác nhận từ chối</button>
          <button type="button" className={styles.btn} onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  )
}
