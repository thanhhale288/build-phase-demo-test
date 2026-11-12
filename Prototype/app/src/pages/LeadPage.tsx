import { LeadControlPanel } from '../components/lead/LeadControlPanel.tsx'
import styles from '../components/lead/lead.module.css'

export function LeadPage() {
  return (
    <main className={`app-main ${styles.page}`}>
      <h1>Tổ trưởng chuyền</h1>
      <p className={styles.lede}>
        Chỉ làm việc với lệnh đã phát trở đi: bắt đầu WO-10, nhập sản lượng hoặc báo tắc WO-11. Không có nút Duyệt / Từ chối. Dữ liệu mô phỏng.
      </p>
      <LeadControlPanel />
    </main>
  )
}
