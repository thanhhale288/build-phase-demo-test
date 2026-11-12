import { useState } from 'react'
import { Alert, App, Button, Popconfirm, Result, Space, Tag, Typography } from 'antd'
import type { HitlRequest } from '../../domain/types.ts'
import { useAppStore } from '../../store/useAppStore.ts'

const ACTION_COLOR: Record<string, string> = {
  RELEASE: 'blue',
  CANCEL: 'red',
  CHANGE_PRIORITY: 'gold',
}

export function HitlRequestCard({ request }: { request: HitlRequest }) {
  const role = useAppStore((s) => s.role)
  const workOrders = useAppStore((s) => s.workOrders)
  const approveHitl = useAppStore((s) => s.approveHitl)
  const rejectHitl = useAppStore((s) => s.rejectHitl)
  const { message } = App.useApp()
  const [outcome, setOutcome] = useState<{ ok: boolean; text: string } | null>(null)
  const wo = workOrders.find((item) => item.wo_id === request.wo_id)

  if (role !== 'dispatcher' && request.status === 'pending') {
    return (
      <div>
        <Typography.Text strong>
          {request.id} · {request.action} · {request.wo_id}
        </Typography.Text>
        <Alert
          style={{ marginTop: 8 }}
          type="info"
          showIcon
          message="Tổ trưởng không duyệt / từ chối phiếu."
        />
      </div>
    )
  }

  const rejectBody =
    request.action === 'CANCEL'
      ? `Từ chối phiếu hủy thì lệnh ${request.wo_id} giữ nguyên trạng thái hiện tại (${wo?.state ?? request.from_state}), không tụt về kế hoạch.`
      : `Từ chối phiếu phát thì lệnh ${request.wo_id} vẫn ở ${wo?.state ?? request.from_state}.`

  return (
    <div>
      <Space wrap size={8}>
        <Typography.Text strong>{request.id}</Typography.Text>
        <Tag color={ACTION_COLOR[request.action]}>{request.action}</Tag>
        <Tag>{request.wo_id}</Tag>
        <Tag>{request.status}</Tag>
      </Space>
      <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 8 }}>
        Lệnh hiện {wo?.state ?? '—'}. Phiếu từ trạng thái {request.from_state}. {request.reason}
      </Typography.Paragraph>
      {request.status === 'pending' ? (
        <Space wrap>
          <Popconfirm
            title={`Duyệt ${request.action} cho ${request.wo_id}?`}
            description="Điều độ viên xác nhận. Hệ thống sẽ re-check cổng. Nếu dữ liệu đã đổi, lệnh không được phát. Giữ chỗ vật tư lúc duyệt: quyết định nhóm đang chờ chốt."
            okText="Xác nhận duyệt"
            cancelText="Hủy"
            onConfirm={() => {
              const result = approveHitl(request.id)
              setOutcome({ ok: result.ok, text: result.message })
              if (result.ok) message.success('Đã duyệt phiếu.')
              else message.error('Không duyệt được.')
            }}
          >
            <Button type="primary">Duyệt</Button>
          </Popconfirm>
          <Popconfirm
            title={`Từ chối phiếu ${request.id}?`}
            description={rejectBody}
            okText="Xác nhận từ chối"
            cancelText="Đóng"
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              const result = rejectHitl(request.id)
              setOutcome({ ok: result.ok, text: result.message })
              if (result.ok) message.success('Đã từ chối phiếu.')
              else message.error('Không từ chối được.')
            }}
          >
            <Button danger>Từ chối</Button>
          </Popconfirm>
        </Space>
      ) : null}
      {outcome && !outcome.ok ? (
        <Result status="error" title="Không duyệt được" subTitle={outcome.text} style={{ padding: '16px 0 0' }} />
      ) : null}
      {outcome && outcome.ok ? <Alert style={{ marginTop: 8 }} type="success" showIcon message={outcome.text} /> : null}
    </div>
  )
}
