import { Button, Space } from 'antd'

const SUGGESTIONS = [
  'Vì sao WO-02 chưa phát được?',
  'WO-01 đủ cổng, đề xuất phát lệnh.',
  'SOP-DISP nói gì khi QC hold?',
  'Liệt kê lệnh quá hạn, không cần đổi chuyền.',
]

export function QuickSuggestions({ onPick }: { onPick: (text: string) => void }) {
  return (
    <Space wrap size={8}>
      {SUGGESTIONS.map((text) => (
        <Button key={text} size="small" onClick={() => onPick(text)}>
          {text}
        </Button>
      ))}
    </Space>
  )
}
