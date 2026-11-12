import { Card, Space, Steps, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { GateId, GateResult } from '../../domain/types.ts'
import { useResponsive } from '../../hooks/useResponsive.ts'
import { MaterialCheckRow } from './MaterialCheckRow.tsx'

const PROPOSED_LABEL = '[Đề xuất – nhóm chưa chốt]'

export const GATE_ORDER: { id: GateId; title: string }[] = [
  { id: 'material', title: 'Vật tư' },
  { id: 'machine', title: 'Máy' },
  { id: 'labor', title: 'Nhân lực' },
  { id: 'bom_rev', title: 'Bản vẽ BOM' },
  { id: 'predecessor', title: 'Công đoạn trước' },
]

function statusText(gate: GateResult | undefined): string {
  if (!gate) return 'Chưa có số liệu'
  if (gate.notApplicable) return 'Không áp dụng'
  return gate.pass ? 'Đạt' : 'Không đạt'
}

function stepStatus(gate: GateResult | undefined): 'finish' | 'error' | 'wait' {
  if (!gate || gate.notApplicable) return 'wait'
  return gate.pass ? 'finish' : 'error'
}

type Row = {
  key: GateId
  name: string
  proposed: boolean
  result: string
  evidence: string
  gate?: GateResult
}

type FiveGatesTableProps = { gates: GateResult[] }

export function FiveGatesTable({ gates }: FiveGatesTableProps) {
  const { isMobile } = useResponsive()
  const rows: Row[] = GATE_ORDER.map((spec) => {
    const gate = gates.find((item) => item.id === spec.id)
    return {
      key: spec.id,
      name: gate?.labelVi?.trim() || spec.title,
      proposed: spec.id === 'predecessor',
      result: statusText(gate),
      evidence: gate?.evidenceVi ?? 'Chưa có bằng chứng từ cổng.',
      gate,
    }
  })

  const top = { onCell: () => ({ style: { verticalAlign: 'top' } }) }
  const columns: ColumnsType<Row> = [
    {
      title: 'Cổng',
      dataIndex: 'name',
      width: 180,
      ...top,
      render: (_, row) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{row.name}</Typography.Text>
          {row.proposed ? <Tag>{PROPOSED_LABEL}</Tag> : null}
        </Space>
      ),
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      width: 130,
      ...top,
      render: (text: string, row) => {
        const gate = row.gate
        const color = !gate || gate.notApplicable ? 'default' : gate.pass ? 'success' : 'error'
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: 'Bằng chứng',
      dataIndex: 'evidence',
      ...top,
      render: (text: string, row) => (
        <div>
          <Typography.Paragraph style={{ marginBottom: 0 }}>{text}</Typography.Paragraph>
          {row.gate?.materialLines?.map((line, index) => (
            <MaterialCheckRow key={`${line.code}-${index}`} line={line} />
          ))}
          {row.key === 'material' ? (
            <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
              Khả dụng = tồn − giữ chỗ. Tăng giữ chỗ lúc duyệt thành công: [Quyết định nhóm đang chờ chốt].
            </Typography.Paragraph>
          ) : null}
        </div>
      ),
    },
  ]

  return (
    <section aria-label="Năm cổng sẵn sàng">
      <Typography.Title level={5}>Năm cổng sẵn sàng</Typography.Title>
      <Steps
        size="small"
        direction="vertical"
        style={{ marginBottom: 16 }}
        items={GATE_ORDER.map((spec) => {
          const gate = gates.find((item) => item.id === spec.id)
          return {
            title: spec.title,
            status: stepStatus(gate),
            description: statusText(gate),
          }
        })}
      />
      {isMobile ? (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {rows.map((row) => {
            const gate = row.gate
            const color = !gate || gate.notApplicable ? 'default' : gate.pass ? 'success' : 'error'
            return (
              <Card key={row.key} size="small" title={row.name} extra={<Tag color={color}>{row.result}</Tag>}>
                {row.proposed ? <Tag style={{ marginBottom: 8 }}>{PROPOSED_LABEL}</Tag> : null}
                <Typography.Paragraph style={{ marginBottom: 0 }}>{row.evidence}</Typography.Paragraph>
                {row.gate?.materialLines?.map((line, index) => (
                  <MaterialCheckRow key={`${line.code}-${index}`} line={line} />
                ))}
                {row.key === 'material' ? (
                  <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                    Khả dụng = tồn − giữ chỗ. Tăng giữ chỗ lúc duyệt thành công: [Quyết định nhóm đang chờ chốt].
                  </Typography.Paragraph>
                ) : null}
              </Card>
            )
          })}
        </Space>
      ) : (
        <Table<Row>
          size="small"
          pagination={false}
          columns={columns}
          dataSource={rows}
          scroll={{ x: 560 }}
          rowKey="key"
        />
      )}
    </section>
  )
}
