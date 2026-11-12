import type { HitlRequest, KanbanColumnId, WorkOrder } from './types.ts'

export function kanbanColumn(wo: WorkOrder, _pending: boolean): KanbanColumnId {
  switch (wo.state) {
    case 'created':
    case 'not_ready':
      return 'chua_phat'
    case 'released':
      return 'da_phat'
    case 'in_progress':
      return 'dang_chay'
    case 'blocked':
      return 'tac'
    case 'done':
    case 'cancelled':
      return 'xong'
  }
}

export function hasPendingBadge(wo: WorkOrder, hitls: HitlRequest[]): boolean {
  return hitls.some((req) => req.wo_id === wo.wo_id && req.status === 'pending')
}
