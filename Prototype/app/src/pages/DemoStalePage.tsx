import { useState } from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { HitlRequestCard } from '../components/hitl/HitlRequestCard.tsx'
import { useAppStore } from '../store/useAppStore.ts'

export function DemoStalePage() {
  const hitlRequests = useAppStore((s) => s.hitlRequests)
  const getReadiness = useAppStore((s) => s.getReadiness)
  const simulateStale = useAppStore((s) => s.simulateStale)
  const workOrders = useAppStore((s) => s.workOrders)
  const [msg, setMsg] = useState<string | null>(null)
  const ticket =
    hitlRequests.find((req) => req.id === 'HITL-09') ?? hitlRequests.find((req) => req.wo_id === 'WO-09')
  const wo = workOrders.find((item) => item.wo_id === 'WO-09')
  const readiness = getReadiness('WO-09')

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
        Demo duyệt khi dữ liệu đã đổi
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        WO-09 bắt đầu đủ cổng và có phiếu RELEASE chờ duyệt. Bấm giả lập xuất kho bu-lông, rồi Duyệt — hệ thống phải từ
        chối, lệnh vẫn created, không tăng giữ chỗ. Dùng Reset Demo trên header (hoặc menu trên điện thoại) để chạy lại.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Trạng thái lệnh: <Typography.Text strong>{wo?.state ?? '—'}</Typography.Text>. Đủ cổng:{' '}
        {readiness.overallReady ? 'có' : 'không'}.
      </Typography.Paragraph>
      <Space wrap style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            const result = simulateStale()
            setMsg(result.message)
          }}
        >
          Giả lập xuất kho đột xuất bu-lông BLT-1
        </Button>
        <Link to="/dispatcher">Về bảng điều độ</Link>
      </Space>
      {msg ? <Typography.Paragraph>{msg}</Typography.Paragraph> : null}
      {ticket ? (
        <Card size="small">
          <HitlRequestCard request={ticket} />
        </Card>
      ) : (
        <Typography.Paragraph type="secondary">Không còn phiếu HITL-09. Hãy bấm Reset Demo.</Typography.Paragraph>
      )}
    </div>
  )
}
