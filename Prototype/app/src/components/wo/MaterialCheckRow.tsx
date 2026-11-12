import { Space, Tag, Typography } from 'antd'
import type { GateResult } from '../../domain/types.ts'

export type MaterialLineView = NonNullable<GateResult['materialLines']>[number]

const DISPLAY: Record<MaterialLineView['label'], string> = {
  'Còn hàng': 'Còn hàng',
  'Dự kiến': 'Sắp về',
  'Không có': 'Không có',
  'QC Hold': 'QC Hold',
}

const COLOR: Record<MaterialLineView['label'], string> = {
  'Còn hàng': 'success',
  'Dự kiến': 'blue',
  'Không có': 'error',
  'QC Hold': 'warning',
}

type MaterialCheckRowProps = { line: MaterialLineView }

export function MaterialCheckRow({ line }: MaterialCheckRowProps) {
  return (
    <div style={{ marginTop: 6 }}>
      <Space wrap size={8}>
        <Typography.Text strong>{line.code}</Typography.Text>
        <Tag color={COLOR[line.label]}>{DISPLAY[line.label] ?? line.label}</Tag>
        <Typography.Text>Cần {line.required}</Typography.Text>
        <Typography.Text>Khả dụng {line.available}</Typography.Text>
        <Typography.Text type="secondary">
          Tồn {line.onHand} · Giữ chỗ {line.reserved}
          {line.qcHold ? ' · QC hold' : ''}
        </Typography.Text>
      </Space>
    </div>
  )
}
