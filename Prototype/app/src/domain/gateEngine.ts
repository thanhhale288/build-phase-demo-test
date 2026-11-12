import type {
  AppSnapshot,
  GateResult,
  MaterialAvailabilityLabel,
  MaterialLineEvidence,
  ReadinessResult,
  WorkOrder,
} from './types.ts'

/** Mốc giờ cố định của ca mô phỏng (Asia/Saigon). */
export const DEMO_NOW = '2026-11-12T16:00:00+07:00'

function findWo(snap: AppSnapshot, woId: string): WorkOrder | undefined {
  return snap.workOrders.find((wo) => wo.wo_id === woId)
}

function materialLabel(available: number, required: number, qcHold: boolean): MaterialAvailabilityLabel {
  if (qcHold) return 'QC Hold'
  if (available >= required) return 'Còn hàng'
  return 'Không có'
}

function materialGate(wo: WorkOrder, snap: AppSnapshot): GateResult {
  const lines: MaterialLineEvidence[] = snap.woMaterials
    .filter((row) => row.wo_id === wo.wo_id && row.critical)
    .map((row) => {
      const mat = snap.materials.find((item) => item.material_code === row.material_code)
      const onHand = mat?.on_hand ?? 0
      const reserved = mat?.reserved ?? 0
      const available = onHand - reserved
      const qcHold = mat?.qc_hold ?? false
      return {
        code: row.material_code,
        required: row.qty_required,
        onHand,
        reserved,
        available,
        qcHold,
        label: materialLabel(available, row.qty_required, qcHold),
      }
    })

  const failed = lines.filter((line) => line.qcHold || line.available < line.required)
  const pass = lines.length > 0 && failed.length === 0
  const evidence =
    lines.length === 0
      ? 'Lệnh không có dòng vật tư then chốt trong dữ liệu mô phỏng.'
      : pass
        ? lines
            .map((line) => `${line.code}: cần ${line.required}, khả dụng ${line.available} (tồn ${line.onHand} − giữ chỗ ${line.reserved}).`)
            .join(' ')
        : failed
            .map((line) =>
              line.qcHold
                ? `${line.code}: đang QC hold, không tính vào tồn khả dụng (cần ${line.required}, tồn ${line.onHand}).`
                : `${line.code}: cần ${line.required}, khả dụng chỉ ${line.available} (tồn ${line.onHand} − giữ chỗ ${line.reserved}).`,
            )
            .join(' ')

  return {
    id: 'material',
    labelVi: 'Vật tư',
    pass,
    evidenceVi: evidence,
    materialLines: lines,
  }
}

function machineGate(wo: WorkOrder, snap: AppSnapshot): GateResult {
  const machine = snap.machines.find((item) => item.machine_id === wo.machine_id)
  if (!machine) {
    return {
      id: 'machine',
      labelVi: 'Máy',
      pass: false,
      evidenceVi: `Không tìm thấy máy ${wo.machine_id} trong dữ liệu mô phỏng.`,
    }
  }
  const busyByOther = machine.current_wo_id != null && machine.current_wo_id !== wo.wo_id
  const pass = machine.status === 'UP' && !busyByOther
  let evidence = `${machine.machine_id} (${machine.name}): trạng thái ${machine.status}`
  if (machine.current_wo_id) {
    evidence += `, đang gắn ${machine.current_wo_id}`
  } else {
    evidence += ', đang rảnh'
  }
  if (machine.status !== 'UP') {
    evidence += '. Không đề xuất đổi máy.'
  } else if (busyByOther) {
    evidence += '. Cổng máy không đạt vì bị lệnh khác chiếm.'
  }
  return { id: 'machine', labelVi: 'Máy', pass, evidenceVi: evidence }
}

function laborGate(wo: WorkOrder, snap: AppSnapshot): GateResult {
  const slot = snap.labor.find(
    (item) =>
      item.shift_id === wo.shift_id &&
      item.machine_id === wo.machine_id &&
      item.skill === wo.required_skill,
  )
  if (!slot) {
    return {
      id: 'labor',
      labelVi: 'Nhân lực',
      pass: false,
      evidenceVi: `Không có định biên skill ${wo.required_skill} cho ${wo.machine_id} / ca ${wo.shift_id}.`,
    }
  }
  const pass = slot.assigned_headcount >= slot.required_headcount
  return {
    id: 'labor',
    labelVi: 'Nhân lực',
    pass,
    evidenceVi: `Skill ${slot.skill}, ca ${slot.shift_id}, máy ${slot.machine_id}: có ${slot.assigned_headcount}/${slot.required_headcount} người.`,
  }
}

function bomGate(wo: WorkOrder, snap: AppSnapshot): GateResult {
  const sku = snap.skus.find((item) => item.sku === wo.sku)
  if (!sku) {
    return {
      id: 'bom_rev',
      labelVi: 'Bản vẽ BOM',
      pass: false,
      evidenceVi: `Không tìm thấy mã ${wo.sku}.`,
    }
  }
  const pass = wo.bom_rev === sku.current_bom_rev
  return {
    id: 'bom_rev',
    labelVi: 'Bản vẽ BOM',
    pass,
    evidenceVi: pass
      ? `Lệnh dùng bản ${wo.bom_rev}, trùng bản hiện hành của ${sku.sku}.`
      : `Lệnh dùng bản ${wo.bom_rev}, bản hiện hành của ${sku.sku} là ${sku.current_bom_rev}. Không quy về thiếu hàng.`,
  }
}

function predecessorGate(wo: WorkOrder, snap: AppSnapshot): GateResult {
  const label = 'Công đoạn trước [Đề xuất – nhóm chưa chốt]'
  if (!wo.predecessor_wo_id) {
    return {
      id: 'predecessor',
      labelVi: label,
      pass: true,
      notApplicable: true,
      proposedUnconfirmed: true,
      evidenceVi: 'Lệnh không có công đoạn tiền nhiệm. Cổng này không áp dụng (đề xuất – nhóm chưa chốt).',
    }
  }
  const pred = findWo(snap, wo.predecessor_wo_id)
  const pass = pred?.state === 'done'
  return {
    id: 'predecessor',
    labelVi: label,
    pass,
    proposedUnconfirmed: true,
    evidenceVi: pred
      ? `Lệnh tiền nhiệm ${pred.wo_id} đang ${pred.state}${pass ? '.' : ', chưa done nên chưa phát được.'}`
      : `Không tìm thấy lệnh tiền nhiệm ${wo.predecessor_wo_id}.`,
  }
}

export function checkReadiness(woId: string, snap: AppSnapshot): ReadinessResult {
  const wo = findWo(snap, woId)
  if (!wo) {
    return {
      woId,
      overallReady: false,
      late: false,
      gates: [],
    }
  }
  const gates = [
    materialGate(wo, snap),
    machineGate(wo, snap),
    laborGate(wo, snap),
    bomGate(wo, snap),
    predecessorGate(wo, snap),
  ]
  const overallReady = gates.every((gate) => gate.pass || gate.notApplicable)
  const late = new Date(wo.due_time).getTime() < new Date(DEMO_NOW).getTime()
  return { woId, overallReady, late, gates }
}
