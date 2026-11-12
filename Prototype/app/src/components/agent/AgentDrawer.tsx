import { useMemo, useState } from 'react'
import { useAppStore } from '../../store/useAppStore.ts'
import type { SopDocument } from '../../domain/types.ts'
import { ChatHistory, type ChatTurn } from './ChatHistory.tsx'
import { QuickSuggestions } from './QuickSuggestions.tsx'
import { SopViewerModal } from './SopViewerModal.tsx'
import styles from './agent.module.css'

type AgentDrawerProps = { woId?: string }

export function AgentDrawer({ woId }: AgentDrawerProps) {
  const inspect = useAppStore((s) => s.inspectQuery)
  const explainBlocked = useAppStore((s) => s.explainBlocked)
  const proposeRelease = useAppStore((s) => s.proposeRelease)
  const lookupSop = useAppStore((s) => s.lookupSop)
  const [input, setInput] = useState('')
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [sop, setSop] = useState<SopDocument | undefined>()
  const sops = useAppStore((s) => s.sops)
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

  return (
    <section className={styles.panel} aria-label="Trợ lý điều độ">
      <h2 className={styles.title}>Trợ lý điều độ</h2>
      <p className={styles.hint}>{intro}</p>
      <ChatHistory turns={turns} />
      <QuickSuggestions onPick={respond} />
      <div className={styles.row}>
        <input
          className={styles.input}
          value={input}
          placeholder="Hỏi về lệnh đang mở…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && input.trim()) {
              respond(input)
              setInput('')
            }
          }}
        />
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => {
            if (!input.trim()) return
            respond(input)
            setInput('')
          }}
        >
          Gửi
        </button>
      </div>
      <div className={styles.sugs}>
        {sops.map((doc) => (
          <button key={doc.sop_id} type="button" className={styles.linkBtn} onClick={() => setSop(doc)}>
            Xem {doc.sop_id}
          </button>
        ))}
        <button type="button" className={styles.linkBtn} onClick={() => respond(`Vì sao ${selected} chưa phát được?`)}>
          Giải thích {selected}
        </button>
      </div>
      {sop ? <SopViewerModal sop={sop} onClose={() => setSop(undefined)} /> : null}
    </section>
  )
}
