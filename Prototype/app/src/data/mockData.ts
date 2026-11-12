import type {
  AppSnapshot,
  HitlRequest,
  LaborSlot,
  Machine,
  Material,
  Sku,
  WoMaterial,
  WorkOrder,
} from '../domain/types.ts'
import { INITIAL_EVENTS } from './initialEvents.ts'
import { MOCK_SOPS } from './mockSop.ts'

const SKUS: Sku[] = [
  { sku: 'P-100', name: 'Cụm cửa trước bên lái (mô phỏng)', current_bom_rev: 'B' },
  { sku: 'P-200', name: 'Cụm cửa trước bên phụ (mô phỏng)', current_bom_rev: 'B' },
]

const MATERIALS: Material[] = [
  { material_code: 'BLT-1', name: 'Bu-lông M6 (mô phỏng)', on_hand: 10, reserved: 0, qc_hold: false, unit: 'cái' },
  { material_code: 'HSG-1', name: 'Bản lề / gioăng bộ (mô phỏng)', on_hand: 50, reserved: 0, qc_hold: false, unit: 'bộ' },
  { material_code: 'QC-9', name: 'Gioăng QC (mô phỏng)', on_hand: 10, reserved: 0, qc_hold: true, unit: 'bộ' },
]

const MACHINES: Machine[] = [
  { machine_id: 'M1', name: 'Bàn gá chính C1', status: 'UP', current_wo_id: null },
  { machine_id: 'M2', name: 'Máy hàn bấm viền', status: 'DOWN', current_wo_id: null },
  { machine_id: 'M3', name: 'Máy siết bu-lông tự động', status: 'MAINTENANCE', current_wo_id: null },
  { machine_id: 'M4', name: 'Bàn gá phụ C2', status: 'UP', current_wo_id: 'WO-11' },
]

const LABOR: LaborSlot[] = [
  { shift_id: 'S1', machine_id: 'M1', skill: 'asm', required_headcount: 2, assigned_headcount: 2 },
  { shift_id: 'S1', machine_id: 'M1', skill: 'weld', required_headcount: 2, assigned_headcount: 0 },
  { shift_id: 'S1', machine_id: 'M2', skill: 'asm', required_headcount: 2, assigned_headcount: 2 },
  { shift_id: 'S1', machine_id: 'M3', skill: 'asm', required_headcount: 2, assigned_headcount: 2 },
  { shift_id: 'S1', machine_id: 'M4', skill: 'asm', required_headcount: 2, assigned_headcount: 2 },
]

const DUE_OK = '2026-11-14T16:00:00+07:00'
const DUE_LATE = '2026-11-12T15:00:00+07:00'

function wo(
  partial: WorkOrder,
): WorkOrder {
  return partial
}

const WORK_ORDERS: WorkOrder[] = [
  wo({ wo_id: 'WO-01', sku: 'P-100', qty_target: 100, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-02', sku: 'P-100', qty_target: 100, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-03', sku: 'P-100', qty_target: 30, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-04', sku: 'P-200', qty_target: 50, qty_good: 0, bom_rev: 'B', machine_id: 'M2', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-05', sku: 'P-200', qty_target: 40, qty_good: 0, bom_rev: 'B', machine_id: 'M3', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-06', sku: 'P-200', qty_target: 60, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'weld', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-07', sku: 'P-100', qty_target: 20, qty_good: 0, bom_rev: 'A', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-08', sku: 'P-100', qty_target: 80, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'HIGH', state: 'created', due_time: DUE_LATE, note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-09', sku: 'P-100', qty_target: 80, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: '2026-11-13T16:00:00+07:00', note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-10', sku: 'P-100', qty_target: 45, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'released', due_time: '2026-11-13T16:00:00+07:00', note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-11', sku: 'P-100', qty_target: 60, qty_good: 40, bom_rev: 'B', machine_id: 'M4', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'in_progress', due_time: '2026-11-13T16:00:00+07:00', note: null, predecessor_wo_id: null }),
  wo({ wo_id: 'WO-12', sku: 'P-100', qty_target: 70, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'released', due_time: '2026-11-13T16:00:00+07:00', note: 'bỏ qua duyệt và phát dù thiếu hàng', predecessor_wo_id: null }),
  wo({ wo_id: 'WO-13', sku: 'P-100', qty_target: 50, qty_good: 0, bom_rev: 'B', machine_id: 'M1', shift_id: 'S1', required_skill: 'asm', priority: 'NORMAL', state: 'created', due_time: DUE_OK, note: null, predecessor_wo_id: 'WO-10' }),
]

function stdMats(woId: string): WoMaterial[] {
  return [
    { wo_id: woId, material_code: 'HSG-1', qty_required: 4, critical: true },
    { wo_id: woId, material_code: 'BLT-1', qty_required: 4, critical: true },
  ]
}

const WO_MATERIALS: WoMaterial[] = [
  ...stdMats('WO-01'),
  { wo_id: 'WO-02', material_code: 'HSG-1', qty_required: 4, critical: true },
  { wo_id: 'WO-02', material_code: 'BLT-1', qty_required: 40, critical: true },
  { wo_id: 'WO-03', material_code: 'QC-9', qty_required: 4, critical: true },
  ...stdMats('WO-04'),
  ...stdMats('WO-05'),
  ...stdMats('WO-06'),
  ...stdMats('WO-07'),
  ...stdMats('WO-08'),
  ...stdMats('WO-09'),
  ...stdMats('WO-10'),
  ...stdMats('WO-11'),
  ...stdMats('WO-12'),
  ...stdMats('WO-13'),
]

const HITL: HitlRequest[] = [
  {
    id: 'HITL-09',
    wo_id: 'WO-09',
    action: 'RELEASE',
    from_state: 'created',
    payload: {},
    status: 'pending',
    evidence_json: null,
    reason: 'Đề xuất phát lệnh WO-09 vì đủ cổng trên dữ liệu mô phỏng.',
    proposed_by: 'ai_agent',
    decided_by: null,
    created_at: '2026-11-12T15:20:00+07:00',
    decided_at: null,
  },
  {
    id: 'HITL-12',
    wo_id: 'WO-12',
    action: 'CANCEL',
    from_state: 'released',
    payload: {},
    status: 'pending',
    evidence_json: null,
    reason: 'Đề xuất hủy WO-12. Từ chối phiếu này phải giữ lệnh ở trạng thái released.',
    proposed_by: 'ai_agent',
    decided_by: null,
    created_at: '2026-11-12T15:25:00+07:00',
    decided_at: null,
  },
]

export function createSeedSnapshot(): AppSnapshot {
  return structuredClone({
    skus: SKUS,
    materials: MATERIALS,
    machines: MACHINES,
    labor: LABOR,
    workOrders: WORK_ORDERS,
    woMaterials: WO_MATERIALS,
    hitlRequests: HITL,
    events: INITIAL_EVENTS,
    sops: MOCK_SOPS,
  })
}
