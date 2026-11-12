import { Card, Empty, List, Typography } from 'antd'
import { useAppStore } from '../../store/useAppStore.ts'
import { HitlRequestCard } from './HitlRequestCard.tsx'

export function HitlPanel() {
  const hitlRequests = useAppStore((s) => s.hitlRequests)
  const pending = hitlRequests.filter((req) => req.status === 'pending')
  return (
    <Card size="small" title="Phiếu chờ duyệt" aria-label="Phiếu chờ duyệt">
      {pending.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có phiếu đang mở." />
      ) : (
        <List
          dataSource={pending}
          renderItem={(req) => (
            <List.Item style={{ display: 'block', paddingInline: 0 }}>
              <HitlRequestCard request={req} />
            </List.Item>
          )}
        />
      )}
      <Typography.Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 8 }}>
        Giữ chỗ vật tư lúc duyệt thành công: quyết định nhóm đang chờ chốt.
      </Typography.Paragraph>
    </Card>
  )
}
