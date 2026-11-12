import { useMemo, useState } from 'react'
import { Button, Card, Input, Space, Typography } from 'antd'
import { useAppStore } from '../../store/useAppStore.ts'
import type { SopCitation, SopDocument } from '../../domain/types.ts'
import { ChatHistory, type ChatTurn } from './ChatHistory.tsx'
import { QuickSuggestions } from './QuickSuggestions.tsx'
import { SopViewerModal } from './SopViewerModal.tsx'

type AgentDrawerProps = { woId?: string }

export function AgentDrawer({ woId }: AgentDrawerProps) {
  const inspect = useAppStore((s) => s.inspectQuery)
  const explainBlocked = useAppStore((s) => s.explainBlocked)
  const proposeRelease = useAppStore((s) => s.proposeRelease)
  const lookupSop = useAppStore((s) => s.lookupSop)
  const sops = useAppStore((s) => s.sops)
  const [input, setInput] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [sop, setSop] = useState<SopDocument | undefined>()
  const selected = woId ?? 'WO-02'

  const intro = useMemo(
    () => 'Trợ lý điều độ (personal agent). Chỉ giải thích số liệu cổng, tra SOP mỏng, và tạo phiếu. Không tự phát lệnh.',
    [],
  )

  function respond(text: string) {
    const user: ChatTurn = { id: `u-${Date.now()}`, role: 'user', text }
    const denied = inspect(text)
    if (denied.blocked) {
      setTurns((t) => [
        ...t,
        user,
        {
          id: `a-${Date.now()}`,
          role: 'agent',
          denied: true,
          text: 'Không thực hiện yêu cầu này. Trợ lý không bỏ qua kiểm tra, không phát lệnh theo duyệt miệng, và không ghi trạng thái released.',
        },
      ])
      return
    }
    if (/đề xuất phát|tạo phiếu/i.test(text)) {
      const m = text.match(/WO-\d+/i)
      const target = m ? m[0].toUpperCase() : selected
      const result = proposeRelease(target)
      setTurns((t) => [...t, user, { id: `a-${Date.now()}`, role: 'agent', text: result.message }])
      return
    }
    const m = text.match(/WO-\d+/i)
    const target = m ? m[0].toUpperCase() : selected
    if (/sop|quy trình|qc hold/i.test(text) && !/WO-\d+/i.test(text)) {
      const found = lookupSop(text.includes('QC') ? 'SOP-Q03' : text)
      const first = found[0]
      setTurns((t) => [
        ...t,
        user,
        {
          id: `a-${Date.now()}`,
          role: 'agent',
          text: first ? `${first.sop_id}: ${first.excerpt}` : 'Không tìm thấy SOP khớp trong bộ tài liệu mô phỏng.',
          citations: first ? [{ sop_id: first.sop_id, title: first.title, excerpt: first.excerpt }] : [],
        },
      ])
      return
    }
    const explanation = explainBlocked(target)
    setTurns((t) => [
      ...t,
      user,
      { id: `a-${Date.now()}`, role: 'agent', text: explanation.text, citations: explanation.citations },
    ])
  }

  function send() {
    if (!input.trim()) return
    respond(input)
    setInput('')
  }

  function openCitation(citation: SopCitation) {
    const found = sops.find((doc) => doc.sop_id === citation.sop_id)
    if (found) setSop(found)
  }

  return (
    <Card size="small" title="Trợ lý điều độ" aria-label="Trợ lý điều độ">
      <Typography.Paragraph type="secondary">{intro}</Typography.Paragraph>
      <div style={{ maxHeight: 240, overflow: 'auto', marginBottom: 8 }}>
        <ChatHistory turns={turns} onOpenCitation={openCitation} />
      </div>
      <QuickSuggestions onPick={respond} />
      <Space.Compact style={{ width: '100%', marginTop: 12 }}>
        <Input
          value={input}
          placeholder="Hỏi về lệnh đang mở…"
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={send}
        />
        <Button type="primary" onClick={send}>
          Gửi
        </Button>
      </Space.Compact>
      <Space wrap size={8} style={{ marginTop: 8 }}>
        {sops.map((doc) => (
          <Button key={doc.sop_id} type="link" size="small" onClick={() => setSop(doc)}>
            Xem {doc.sop_id}
          </Button>
        ))}
        <Button type="link" size="small" onClick={() => respond(`Vì sao ${selected} chưa phát được?`)}>
          Giải thích {selected}
        </Button>
      </Space>
      {sop ? <SopViewerModal sop={sop} onClose={() => setSop(undefined)} /> : null}
    </Card>
  )
}
