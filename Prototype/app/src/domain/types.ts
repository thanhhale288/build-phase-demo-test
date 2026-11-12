export type Role = 'dispatcher' | 'line_lead'

export type WoState =
  | 'created'
  | 'not_ready'
  | 'released'
  | 'in_progress'
  | 'blocked'
  | 'done'
  | 'cancelled'

export type MachineStatus = 'UP' | 'DOWN' | 'MAINTENANCE'
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
export type HitlAction = 'RELEASE' | 'CANCEL' | 'CHANGE_PRIORITY'
export type HitlStatus = 'pending' | 'approved' | 'rejected'
export type GateId = 'material' | 'machine' | 'labor' | 'bom_rev' | 'predecessor'
export type MaterialAvailabilityLabel = 'Còn hàng' | 'Dự kiến' | 'Không có' | 'QC Hold'
export type KanbanColumnId = 'chua_phat' | 'da_phat' | 'dang_chay' | 'tac' | 'xong'

export type Sku = {
  sku: string
  name: string
  current_bom_rev: string
}

export type Material = {
  material_code: string
  name: string
  on_hand: number
  reserved: number
  qc_hold: boolean
  unit: string
}

export type Machine = {
  machine_id: string
  name: string
  status: MachineStatus
  current_wo_id: string | null
}

export type LaborSlot = {
  shift_id: string
  machine_id: string
  skill: string
  required_headcount: number
  assigned_headcount: number
}

export type WorkOrder = {
  wo_id: string
  sku: string
  qty_target: number
  qty_good: number
  bom_rev: string
  machine_id: string
  shift_id: string
  required_skill: string
  priority: Priority
  state: WoState
  due_time: string
  note: string | null
  predecessor_wo_id: string | null
}

export type WoMaterial = {
  wo_id: string
  material_code: string
  qty_required: number
  critical: boolean
}

export type HitlRequest = {
  id: string
  wo_id: string
  action: HitlAction
  from_state: WoState
  payload: Record<string, unknown>
  status: HitlStatus
  evidence_json: unknown
  reason: string | null
  proposed_by: string
  decided_by: string | null
  created_at: string
  decided_at: string | null
}

export type AuditEvent = {
  id: string
  wo_id: string
  actor: string
  role: Role | 'system' | 'ai_agent'
  type: string
  from_state: WoState | null
  to_state: WoState | null
  payload: Record<string, unknown> | null
  ts: string
}

export type SopDocument = {
  sop_id: string
  title: string
  category: string
  target_sku_or_process: string
  effective_rev: string
  excerpt: string
  last_updated: string
}

export type MaterialLineEvidence = {
  code: string
  required: number
  onHand: number
  reserved: number
  available: number
  qcHold: boolean
  label: MaterialAvailabilityLabel
}

export type GateResult = {
  id: GateId
  labelVi: string
  pass: boolean
  notApplicable?: boolean
  proposedUnconfirmed?: boolean
  evidenceVi: string
  materialLines?: MaterialLineEvidence[]
}

export type ReadinessResult = {
  woId: string
  overallReady: boolean
  late: boolean
  gates: GateResult[]
}

export type AppSnapshot = {
  skus: Sku[]
  materials: Material[]
  machines: Machine[]
  labor: LaborSlot[]
  workOrders: WorkOrder[]
  woMaterials: WoMaterial[]
  hitlRequests: HitlRequest[]
  events: AuditEvent[]
  sops: SopDocument[]
}

export type ActionResult = {
  ok: boolean
  message: string
  requestId?: string
}

export type InspectResult = {
  blocked: boolean
  matched?: string
}

export type SopCitation = {
  sop_id: string
  title: string
  excerpt: string
}

export type Explanation = {
  text: string
  citations: SopCitation[]
  gates: GateResult[]
}
