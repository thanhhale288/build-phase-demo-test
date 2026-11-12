import { List, Tag, Typography } from 'antd'
import type { SopCitation } from '../../domain/types.ts'

export type ChatTurn = {
  id: string
  role: 'user' | 'agent'
  text: string
  citations?: SopCitation[]
  denied?: boolean
}

type ChatHistoryProps = {
  turns: ChatTurn[]
  onOpenCitation?: (citation: SopCitation) => void
}

export function ChatHistory({ turns, onOpenCitation }: ChatHistoryProps) {
  if (turns.length === 0) {
    return <Typography.Text type="secondary">Chưa có trao đổi trong phiên này.</Typography.Text>
  }
  return (
    <List
      size="small"
      dataSource={turns}
      renderItem={(turn) => (
        <List.Item style={{ display: 'block' }}>
          <Typography.Text strong>{turn.role === 'user' ? 'Bạn' : 'Trợ lý điều độ'}</Typography.Text>
          <Typography.Paragraph
            style={{ marginTop: 4, marginBottom: 4 }}
            type={turn.denied ? 'danger' : undefined}
          >
            {turn.text}
          </Typography.Paragraph>
          {turn.citations?.map((c) => (
            <Tag key={c.sop_id} style={{ cursor: 'pointer' }} onClick={() => onOpenCitation?.(c)}>
              {c.sop_id} — {c.title}
            </Tag>
          ))}
        </List.Item>
      )}
    />
  )
}
