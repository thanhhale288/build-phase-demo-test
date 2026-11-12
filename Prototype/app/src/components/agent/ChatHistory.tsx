import type { SopCitation } from '../../domain/types.ts'
import styles from './agent.module.css'

export type ChatTurn = {
  id: string
  role: 'user' | 'agent'
  text: string
  citations?: SopCitation[]
  denied?: boolean
}

export function ChatHistory({ turns }: { turns: ChatTurn[] }) {
  return (
    <div className={styles.history}>
      {turns.map((turn) => (
        <div key={turn.id} className={turn.role === 'user' ? `${styles.bubble} ${styles.bubbleUser}` : styles.bubble}>
          <strong>{turn.role === 'user' ? 'Bạn' : 'Trợ lý điều độ'}</strong>
          <p className={turn.denied ? styles.deny : undefined}>{turn.text}</p>
          {turn.citations?.map((c) => (
            <p key={c.sop_id} className={styles.cite}>
              {c.sop_id} — {c.title}: {c.excerpt}
            </p>
          ))}
        </div>
      ))}
    </div>
  )
}
