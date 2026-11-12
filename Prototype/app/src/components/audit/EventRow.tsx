import type { AuditEvent } from '../../domain/types.ts'

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

export function EventRow({ event }: { event: AuditEvent }) {
  return (
    <tr>
      <td className="ts">{formatTs(event.ts)}</td>
      <td>{event.wo_id}</td>
      <td>{event.actor}</td>
      <td>{event.role}</td>
      <td>{event.type}</td>
      <td>{event.from_state ?? '—'}</td>
      <td>{event.to_state ?? '—'}</td>
    </tr>
  )
}
