import styles from './agent.module.css'

const SUGGESTIONS = [
  'Vì sao WO-02 chưa phát được?',
  'WO-01 đủ cổng, đề xuất phát lệnh.',
  'SOP-DISP nói gì khi QC hold?',
  'Liệt kê lệnh quá hạn, không cần đổi chuyền.',
]

export function QuickSuggestions({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className={styles.sugs}>
      {SUGGESTIONS.map((text) => (
        <button key={text} type="button" className={styles.btn} onClick={() => onPick(text)}>
          {text}
        </button>
      ))}
    </div>
  )
}
