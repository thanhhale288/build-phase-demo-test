import { useMemo } from 'react'
import { Table, Timeline, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { AuditEvent } from '../domain/types.ts'
import { useAppStore } from '../store/useAppStore.ts'

function formatTs(ts: string): string {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d)
}

export function AuditPage() {
  const events = useAppStore((s) => s.events)
  const rows = useMemo(
    () => [...events].sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0)),
    [events],
  )

  const woFilters = [...new Set(rows.map((e) => e.wo_id))].sort().map((v) => ({ text: v, value: v }))
  const typeFilters = [...new Set(rows.map((e) => e.type))].sort().map((v) => ({ text: v, value: v }))
  const roleFilters = [...new Set(rows.map((e) => e.role))].sort().map((v) => ({ text: v, value: v }))

  const columns: ColumnsType<AuditEvent> = [
    { title: 'Thời điểm', dataIndex: 'ts', width: 190, render: (ts: string) => formatTs(ts) },
    { title: 'Lệnh', dataIndex: 'wo_id', width: 100, filters: woFilters, onFilter: (value, record) => record.wo_id === value },
    { title: 'Người', dataIndex: 'actor', width: 160 },
    { title: 'Vai', dataIndex: 'role', width: 110, filters: roleFilters, onFilter: (value, record) => record.role === value },
    { title: 'Sự kiện', dataIndex: 'type', filters: typeFilters, onFilter: (value, record) => record.type === value },
    { title: 'Từ', dataIndex: 'from_state', width: 110, render: (v: string | null) => v ?? '—' },
    { title: 'Sang', dataIndex: 'to_state', width: 110, render: (v: string | null) => v ?? '—' },
  ]

  const recent = rows.slice(0, 8)

  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
        Nhật ký thao tác
      </Typography.Title>
      <Typography.Paragraph type="secondary">Giờ hiển thị theo Asia/Saigon. Dữ liệu mô phỏng.</Typography.Paragraph>
      {recent.length > 0 ? (
        <Timeline
          style={{ marginBottom: 16 }}
          items={recent.map((event) => ({
            children: `${formatTs(event.ts)} · ${event.wo_id} · ${event.type} · ${event.actor}`,
          }))}
        />
      ) : null}
      <Table<AuditEvent>
        size="small"
        rowKey="id"
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 12, showSizeChanger: false }}
        scroll={{ x: 860 }}
      />
    </div>
  )
}
