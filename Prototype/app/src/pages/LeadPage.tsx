import { Typography } from 'antd'
import { LeadControlPanel } from '../components/lead/LeadControlPanel.tsx'

export function LeadPage() {
  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
        Tổ trưởng chuyền
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Chỉ làm việc với lệnh đã phát trở đi: bắt đầu WO-10, nhập sản lượng hoặc báo tắc WO-11. Không có nút Duyệt / Từ
        chối. Dữ liệu mô phỏng.
      </Typography.Paragraph>
      <LeadControlPanel />
    </div>
  )
}
