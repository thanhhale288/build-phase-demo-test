import type { GateId, GateResult } from '../../domain/types.ts'
import { MaterialCheckRow } from './MaterialCheckRow.tsx'
import styles from './wo.module.css'

const PROPOSED_LABEL = '[Đề xuất – nhóm chưa chốt]'

export const GATE_ORDER: { id: GateId; title: string }[] = [
  { id: 'material', title: 'Vật tư' },
  { id: 'machine', title: 'Máy' },
  { id: 'labor', title: 'Nhân lực' },
  { id: 'bom_rev', title: 'Bản vẽ BOM' },
  { id: 'predecessor', title: 'Công đoạn trước' },
]

type LampKind = 'pass' | 'fail' | 'na' | 'unknown'

function lampKind(gate: GateResult | undefined): LampKind {
  if (!gate) return 'unknown'
  if (gate.notApplicable) return 'na'
  return gate.pass ? 'pass' : 'fail'
}

function statusText(gate: GateResult | undefined): string {
  if (!gate) return 'Chưa có số liệu'
  if (gate.notApplicable) return 'Không áp dụng'
  return gate.pass ? 'Đạt' : 'Không đạt'
}

const LAMP_CLASS: Record<LampKind, string> = {
  pass: styles.lampPass,
  fail: styles.lampFail,
  na: styles.lampNa,
  unknown: '',
}

const STATUS_CLASS: Record<LampKind, string> = {
  pass: styles.passText,
  fail: styles.failText,
  na: styles.naText,
  unknown: styles.muted,
}

type FiveGatesTableProps = {
  gates: GateResult[]
}

export function FiveGatesTable({ gates }: FiveGatesTableProps) {
  return (
    <section aria-label="Năm cổng sẵn sàng">
      <h3 className={styles.sectionTitle}>Năm cổng sẵn sàng</h3>
      <p className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.lamp} ${styles.lampPass}`} aria-hidden="true" />
          Đạt
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.lamp} ${styles.lampFail}`} aria-hidden="true" />
          Không đạt
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.lamp} ${styles.lampNa}`} aria-hidden="true" />
          Không áp dụng
        </span>
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Cổng</th>
              <th scope="col">Kết quả</th>
              <th scope="col">Bằng chứng</th>
            </tr>
          </thead>
          <tbody>
            {GATE_ORDER.map((spec) => {
              const gate = gates.find((item) => item.id === spec.id)
              const kind = lampKind(gate)
              const showProposed = spec.id === 'predecessor'
              const name = showProposed ? spec.title : (gate?.labelVi?.trim() || spec.title)
              const lines = gate?.materialLines

              return (
                <tr key={spec.id} data-gate={spec.id} data-result={kind}>
                  <th scope="row">
                    <span className={styles.gateName}>
                      <span
                        className={`${styles.lamp} ${LAMP_CLASS[kind]}`}
                        aria-hidden="true"
                      />
                      {name}
                    </span>
                    {showProposed ? (
                      <span className={styles.proposed}>{PROPOSED_LABEL}</span>
                    ) : null}
                  </th>
                  <td className={STATUS_CLASS[kind]}>{statusText(gate)}</td>
                  <td>
                    {gate?.evidenceVi ? (
                      <p className={styles.evidence}>{gate.evidenceVi}</p>
                    ) : (
                      <p className={styles.muted}>Chưa có bằng chứng từ cổng.</p>
                    )}
                    {lines && lines.length > 0 ? (
                      <div className={styles.materials}>
                        {lines.map((line, index) => (
                          <MaterialCheckRow key={`${line.code}-${index}`} line={line} />
                        ))}
                      </div>
                    ) : null}
                    {spec.id === 'material' ? (
                      <p className={styles.policyNote}>
                        Khả dụng = tồn − giữ chỗ. Tăng giữ chỗ lúc duyệt thành công: [Quyết định nhóm đang chờ chốt].
                      </p>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
