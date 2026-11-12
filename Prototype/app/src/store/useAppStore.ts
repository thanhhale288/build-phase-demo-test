import { create } from 'zustand'
import { createSeedSnapshot } from '../data/mockData.ts'
import { checkReadiness } from '../domain/gateEngine.ts'
import { inspectQuery } from '../domain/guardrails.ts'
import type {
  ActionResult,
  AppSnapshot,
  AuditEvent,
  Explanation,
  HitlRequest,
  InspectResult,
  MachineStatus,
  ReadinessResult,
  Role,
  SopCitation,
  SopDocument,
  WoState,
} from '../domain/types.ts'

let eventSeq = 100
let hitlSeq = 20

function nowIso(): string {
  return new Date().toISOString()
}

function cloneSeed(): AppSnapshot {
  return createSeedSnapshot()
}

function pushEvent(
  snap: AppSnapshot,
  partial: Omit<AuditEvent, 'id' | 'ts'> & { ts?: string },
): AuditEvent {
  eventSeq += 1
  const event: AuditEvent = {
    id: `EV-${eventSeq}`,
    ts: partial.ts ?? nowIso(),
    wo_id: partial.wo_id,
    actor: partial.actor,
    role: partial.role,
    type: partial.type,
    from_state: partial.from_state,
    to_state: partial.to_state,
    payload: partial.payload,
  }
  snap.events = [...snap.events, event]
  return event
}

function sopForGate(sops: SopDocument[], gateId: string): SopDocument | undefined {
  const map: Record<string, string> = {
    material: 'SOP-M01',
    machine: 'SOP-E02',
    labor: 'SOP-E02',
    bom_rev: 'SOP-B04',
    predecessor: 'SOP-O05',
  }
  const qc = sops.find((s) => s.sop_id === 'SOP-Q03')
  if (gateId === 'material') {
    return sops.find((s) => s.sop_id === 'SOP-M01')
  }
  const id = map[gateId]
  return sops.find((s) => s.sop_id === id) ?? qc
}

export type AppStore = AppSnapshot & {
  role: Role
  setRole: (role: Role) => void
  resetSeed: () => void
  getReadiness: (woId: string) => ReadinessResult
  snapshot: () => AppSnapshot
  proposeRelease: (woId: string, actor?: string) => ActionResult
  approveHitl: (id: string, actor?: string) => ActionResult
  rejectHitl: (id: string, actor?: string) => ActionResult
  startOrder: (woId: string, actor?: string) => ActionResult
  reportProgress: (woId: string, qtyGood: number, actor?: string) => ActionResult
  blockOrder: (woId: string, reason: string, actor?: string) => ActionResult
  simulateStale: () => ActionResult
  setMachineStatus: (machineId: string, status: MachineStatus) => ActionResult
  inspectQuery: (text: string) => InspectResult
  lookupSop: (idOrText: string) => SopDocument[]
  explainBlocked: (woId: string) => Explanation
}

function currentSnap(state: AppStore): AppSnapshot {
  return {
    skus: state.skus,
    materials: state.materials,
    machines: state.machines,
    labor: state.labor,
    workOrders: state.workOrders,
    woMaterials: state.woMaterials,
    hitlRequests: state.hitlRequests,
    events: state.events,
    sops: state.sops,
  }
}

export const useAppStore = create<AppStore>((set, get) => ({
  ...cloneSeed(),
  role: 'dispatcher',

  setRole: (role) => set({ role }),

  resetSeed: () => {
    eventSeq = 100
    hitlSeq = 20
    set({ ...cloneSeed() })
  },

  snapshot: () => currentSnap(get()),

  getReadiness: (woId) => checkReadiness(woId, currentSnap(get())),

  inspectQuery: (text) => inspectQuery(text),

  lookupSop: (idOrText) => {
    const q = idOrText.trim().toLowerCase()
    const { sops } = get()
    if (!q) return sops
    return sops.filter(
      (sop) =>
        sop.sop_id.toLowerCase() === q ||
        sop.title.toLowerCase().includes(q) ||
        sop.excerpt.toLowerCase().includes(q) ||
        sop.target_sku_or_process.toLowerCase().includes(q),
    )
  },

  explainBlocked: (woId) => {
    const snap = currentSnap(get())
    const readiness = checkReadiness(woId, snap)
    const failed = readiness.gates.filter((g) => !g.pass && !g.notApplicable)
    const citations: SopCitation[] = []
    for (const gate of failed) {
      const sop =
        gate.id === 'material' && gate.materialLines?.some((line) => line.qcHold)
          ? snap.sops.find((item) => item.sop_id === 'SOP-Q03')
          : sopForGate(snap.sops, gate.id)
      if (sop && !citations.some((c) => c.sop_id === sop.sop_id)) {
        citations.push({ sop_id: sop.sop_id, title: sop.title, excerpt: sop.excerpt })
      }
    }
    const wo = snap.workOrders.find((item) => item.wo_id === woId)
    let text: string
    if (!wo) {
      text = `Không tìm thấy lệnh ${woId} trong dữ liệu mô phỏng.`
    } else if (readiness.overallReady) {
      text = `${woId} đủ năm cổng trên dữ liệu mô phỏng. Trợ lý không tự phát lệnh; nếu cần phát, hãy tạo phiếu để điều độ viên duyệt.`
    } else {
      text =
        `${woId} chưa đủ điều kiện phát. ` +
        failed.map((g) => `${g.labelVi}: ${g.evidenceVi}`).join(' ') +
        ' Các số liệu trên lấy từ kết quả cổng, không phải ước lượng.'
    }
    return { text, citations, gates: readiness.gates }
  },

  proposeRelease: (woId, actor = 'Trợ lý điều độ') => {
    const snap = currentSnap(get())
    const wo = snap.workOrders.find((item) => item.wo_id === woId)
    if (!wo) return { ok: false, message: `Không tìm thấy ${woId}.` }
    const readiness = checkReadiness(woId, snap)
    if (!readiness.overallReady) {
      return { ok: false, message: `${woId} chưa đủ cổng, không tạo phiếu phát lệnh.` }
    }
    const dup = snap.hitlRequests.some(
      (req) => req.wo_id === woId && req.action === 'RELEASE' && req.status === 'pending',
    )
    if (dup) {
      return { ok: false, message: `${woId} đã có phiếu phát lệnh đang chờ duyệt.` }
    }
    hitlSeq += 1
    const id = `HITL-${hitlSeq}`
    const ticket: HitlRequest = {
      id,
      wo_id: woId,
      action: 'RELEASE',
      from_state: wo.state,
      payload: {},
      status: 'pending',
      evidence_json: readiness,
      reason: `Đề xuất phát ${woId} vì đủ cổng trên dữ liệu mô phỏng.`,
      proposed_by: 'ai_agent',
      decided_by: null,
      created_at: nowIso(),
      decided_at: null,
    }
    snap.hitlRequests = [...snap.hitlRequests, ticket]
    pushEvent(snap, {
      wo_id: woId,
      actor,
      role: 'ai_agent',
      type: 'HITL_PROPOSED',
      from_state: wo.state,
      to_state: wo.state,
      payload: { hitl_id: id, action: 'RELEASE' },
    })
    set({ hitlRequests: snap.hitlRequests, events: snap.events })
    return { ok: true, message: `Đã tạo phiếu ${id} cho ${woId}. Trợ lý không tự phát lệnh.`, requestId: id }
  },

  approveHitl: (id, actor = 'Điều độ viên') => {
    if (get().role !== 'dispatcher') {
      return { ok: false, message: 'Chỉ điều độ viên được duyệt phiếu.' }
    }
    const snap = currentSnap(get())
    const ticket = snap.hitlRequests.find((item) => item.id === id)
    if (!ticket || ticket.status !== 'pending') {
      return { ok: false, message: 'Không tìm thấy phiếu đang chờ.' }
    }
    const wo = snap.workOrders.find((item) => item.wo_id === ticket.wo_id)
    if (!wo) return { ok: false, message: 'Không tìm thấy lệnh của phiếu.' }

    if (ticket.action === 'RELEASE') {
      const readiness = checkReadiness(wo.wo_id, snap)
      if (!readiness.overallReady) {
        pushEvent(snap, {
          wo_id: wo.wo_id,
          actor,
          role: 'dispatcher',
          type: 'STALE_APPROVE_BLOCKED',
          from_state: wo.state,
          to_state: wo.state,
          payload: { hitl_id: id },
        })
        set({ events: snap.events })
        return {
          ok: false,
          message:
            'Duyệt thất bại! Dữ liệu hiện trường đã thay đổi sau khi mở phiếu. Cổng kiểm tra không còn thỏa mãn. Lệnh không được phát, giữ chỗ không tăng.',
        }
      }
      const from = wo.state
      wo.state = 'released'
      for (const row of snap.woMaterials.filter((item) => item.wo_id === wo.wo_id && item.critical)) {
        const mat = snap.materials.find((item) => item.material_code === row.material_code)
        if (mat) mat.reserved += row.qty_required
      }
      ticket.status = 'approved'
      ticket.decided_by = actor
      ticket.decided_at = nowIso()
      snap.workOrders = snap.workOrders.map((item) => (item.wo_id === wo.wo_id ? { ...wo } : item))
      snap.materials = snap.materials.map((item) => ({ ...item }))
      snap.hitlRequests = snap.hitlRequests.map((item) => (item.id === id ? { ...ticket } : item))
      pushEvent(snap, {
        wo_id: wo.wo_id,
        actor,
        role: 'dispatcher',
        type: 'ORDER_RELEASED',
        from_state: from,
        to_state: 'released',
        payload: { hitl_id: id, reserved: 'tăng lúc duyệt (quyết định nhóm đang chờ chốt)' },
      })
      set({
        workOrders: snap.workOrders,
        materials: snap.materials,
        hitlRequests: snap.hitlRequests,
        events: snap.events,
      })
      return { ok: true, message: `Đã phát ${wo.wo_id}. Giữ chỗ vật tư đã tăng (quyết định nhóm đang chờ chốt).` }
    }

    if (ticket.action === 'CANCEL') {
      const from = wo.state
      const next: WoState = 'cancelled'
      wo.state = next
      ticket.status = 'approved'
      ticket.decided_by = actor
      ticket.decided_at = nowIso()
      snap.workOrders = snap.workOrders.map((item) => (item.wo_id === wo.wo_id ? { ...wo } : item))
      snap.hitlRequests = snap.hitlRequests.map((item) => (item.id === id ? { ...ticket } : item))
      pushEvent(snap, {
        wo_id: wo.wo_id,
        actor,
        role: 'dispatcher',
        type: 'ORDER_CANCELLED',
        from_state: from,
        to_state: next,
        payload: { hitl_id: id },
      })
      set({ workOrders: snap.workOrders, hitlRequests: snap.hitlRequests, events: snap.events })
      return { ok: true, message: `Đã duyệt hủy ${wo.wo_id}.` }
    }

    return { ok: false, message: 'Loại phiếu này chưa hỗ trợ trong prototype.' }
  },

  rejectHitl: (id, actor = 'Điều độ viên') => {
    if (get().role !== 'dispatcher') {
      return { ok: false, message: 'Chỉ điều độ viên được từ chối phiếu.' }
    }
    const snap = currentSnap(get())
    const ticket = snap.hitlRequests.find((item) => item.id === id)
    if (!ticket || ticket.status !== 'pending') {
      return { ok: false, message: 'Không tìm thấy phiếu đang chờ.' }
    }
    const wo = snap.workOrders.find((item) => item.wo_id === ticket.wo_id)
    const kept = wo?.state ?? ticket.from_state
    ticket.status = 'rejected'
    ticket.decided_by = actor
    ticket.decided_at = nowIso()
    snap.hitlRequests = snap.hitlRequests.map((item) => (item.id === id ? { ...ticket } : item))
    pushEvent(snap, {
      wo_id: ticket.wo_id,
      actor,
      role: 'dispatcher',
      type: 'HITL_REJECTED',
      from_state: kept,
      to_state: kept,
      payload: { hitl_id: id, action: ticket.action },
    })
    set({ hitlRequests: snap.hitlRequests, events: snap.events })
    return {
      ok: true,
      message: `Đã từ chối phiếu ${id}. Lệnh ${ticket.wo_id} vẫn ở trạng thái ${kept}.`,
    }
  },

  startOrder: (woId, actor = 'Tổ trưởng chuyền') => {
    if (get().role !== 'line_lead') {
      return { ok: false, message: 'Chỉ tổ trưởng được bắt đầu lệnh.' }
    }
    const snap = currentSnap(get())
    const wo = snap.workOrders.find((item) => item.wo_id === woId)
    if (!wo) return { ok: false, message: `Không tìm thấy ${woId}.` }
    if (wo.state !== 'released') {
      return { ok: false, message: 'Chỉ bắt đầu lệnh đã phát.' }
    }
    const from = wo.state
    wo.state = 'in_progress'
    const machine = snap.machines.find((item) => item.machine_id === wo.machine_id)
    if (machine) machine.current_wo_id = wo.wo_id
    snap.workOrders = snap.workOrders.map((item) => (item.wo_id === woId ? { ...wo } : item))
    snap.machines = snap.machines.map((item) => ({ ...item }))
    pushEvent(snap, {
      wo_id: woId,
      actor,
      role: 'line_lead',
      type: 'ORDER_STARTED',
      from_state: from,
      to_state: 'in_progress',
      payload: { machine_id: wo.machine_id },
    })
    set({ workOrders: snap.workOrders, machines: snap.machines, events: snap.events })
    return { ok: true, message: `Đã bắt đầu ${woId}.` }
  },

  reportProgress: (woId, qtyGood, actor = 'Tổ trưởng chuyền') => {
    if (get().role !== 'line_lead') {
      return { ok: false, message: 'Chỉ tổ trưởng được nhập sản lượng.' }
    }
    const snap = currentSnap(get())
    const wo = snap.workOrders.find((item) => item.wo_id === woId)
    if (!wo) return { ok: false, message: `Không tìm thấy ${woId}.` }
    if (wo.state !== 'in_progress') {
      return { ok: false, message: 'Chỉ nhập sản lượng khi lệnh đang chạy.' }
    }
    if (!Number.isFinite(qtyGood) || qtyGood < wo.qty_good) {
      return { ok: false, message: 'Số nhập phải là số và không nhỏ hơn sản lượng đã có.' }
    }
    const from = wo.state
    wo.qty_good = qtyGood
    let to: WoState = wo.state
    if (wo.qty_good >= wo.qty_target) {
      wo.state = 'done'
      to = 'done'
      const machine = snap.machines.find((item) => item.machine_id === wo.machine_id)
      if (machine && machine.current_wo_id === wo.wo_id) machine.current_wo_id = null
    }
    snap.workOrders = snap.workOrders.map((item) => (item.wo_id === woId ? { ...wo } : item))
    snap.machines = snap.machines.map((item) => ({ ...item }))
    pushEvent(snap, {
      wo_id: woId,
      actor,
      role: 'line_lead',
      type: to === 'done' ? 'ORDER_DONE' : 'PROGRESS_REPORTED',
      from_state: from,
      to_state: to,
      payload: { qty_good: wo.qty_good, qty_target: wo.qty_target },
    })
    set({ workOrders: snap.workOrders, machines: snap.machines, events: snap.events })
    return {
      ok: true,
      message:
        to === 'done'
          ? `${woId} đã đủ sản lượng và chuyển sang Xong.`
          : `Đã ghi sản lượng ${wo.qty_good}/${wo.qty_target} cho ${woId}.`,
    }
  },

  blockOrder: (woId, reason, actor = 'Tổ trưởng chuyền') => {
    if (get().role !== 'line_lead') {
      return { ok: false, message: 'Chỉ tổ trưởng được báo tắc.' }
    }
    const snap = currentSnap(get())
    const wo = snap.workOrders.find((item) => item.wo_id === woId)
    if (!wo) return { ok: false, message: `Không tìm thấy ${woId}.` }
    if (wo.state !== 'released' && wo.state !== 'in_progress') {
      return { ok: false, message: 'Chỉ báo tắc lệnh đã phát hoặc đang chạy.' }
    }
    const from = wo.state
    wo.state = 'blocked'
    snap.workOrders = snap.workOrders.map((item) => (item.wo_id === woId ? { ...wo } : item))
    pushEvent(snap, {
      wo_id: woId,
      actor,
      role: 'line_lead',
      type: 'ORDER_BLOCKED',
      from_state: from,
      to_state: 'blocked',
      payload: { reason },
    })
    set({ workOrders: snap.workOrders, events: snap.events })
    return { ok: true, message: `Đã báo tắc ${woId}. Lệnh không tự về Đã phát.` }
  },

  simulateStale: () => {
    const snap = currentSnap(get())
    const mat = snap.materials.find((item) => item.material_code === 'BLT-1')
    if (!mat) return { ok: false, message: 'Không tìm thấy BLT-1.' }
    mat.on_hand = 0
    snap.materials = snap.materials.map((item) => (item.material_code === 'BLT-1' ? { ...mat } : item))
    pushEvent(snap, {
      wo_id: 'WO-09',
      actor: 'Hệ thống demo',
      role: 'system',
      type: 'DEMO_STALE_STOCK',
      from_state: 'created',
      to_state: 'created',
      payload: { material: 'BLT-1', on_hand: 0 },
    })
    set({ materials: snap.materials, events: snap.events })
    return {
      ok: true,
      message: 'Đã giả lập xuất kho BLT-1 (tồn = 0). Phiếu WO-09 nếu duyệt sẽ thất bại vì cổng vật tư đỏ.',
    }
  },

  setMachineStatus: (machineId, status) => {
    const snap = currentSnap(get())
    const machine = snap.machines.find((item) => item.machine_id === machineId)
    if (!machine) return { ok: false, message: `Không tìm thấy máy ${machineId}.` }
    machine.status = status
    snap.machines = snap.machines.map((item) => (item.machine_id === machineId ? { ...machine } : item))
    pushEvent(snap, {
      wo_id: snap.workOrders.find((wo) => wo.machine_id === machineId)?.wo_id ?? 'WO-04',
      actor: 'Hệ thống demo',
      role: 'system',
      type: 'MACHINE_STATUS',
      from_state: null,
      to_state: null,
      payload: { machine_id: machineId, status },
    })
    set({ machines: snap.machines, events: snap.events })
    return { ok: true, message: `${machineId} chuyển sang ${status}.` }
  },
}))
