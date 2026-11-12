import type { AuditEvent } from '../domain/types.ts'

export const INITIAL_EVENTS: AuditEvent[] = [
  {
    id: 'EV-SEED-09',
    wo_id: 'WO-09',
    actor: 'Trợ lý điều độ',
    role: 'ai_agent',
    type: 'HITL_PROPOSED',
    from_state: 'created',
    to_state: 'created',
    payload: { hitl_id: 'HITL-09', action: 'RELEASE' },
    ts: '2026-11-12T15:20:00+07:00',
  },
  {
    id: 'EV-SEED-12',
    wo_id: 'WO-12',
    actor: 'Trợ lý điều độ',
    role: 'ai_agent',
    type: 'HITL_PROPOSED',
    from_state: 'released',
    to_state: 'released',
    payload: { hitl_id: 'HITL-12', action: 'CANCEL' },
    ts: '2026-11-12T15:25:00+07:00',
  },
  {
    id: 'EV-SEED-11',
    wo_id: 'WO-11',
    actor: 'Tổ trưởng chuyền',
    role: 'line_lead',
    type: 'ORDER_STARTED',
    from_state: 'released',
    to_state: 'in_progress',
    payload: { machine_id: 'M4' },
    ts: '2026-11-12T14:10:00+07:00',
  },
]
