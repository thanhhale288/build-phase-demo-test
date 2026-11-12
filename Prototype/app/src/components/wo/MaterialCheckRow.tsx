import type { GateResult } from '../../domain/types.ts'
import styles from './wo.module.css'

export type MaterialLineView = NonNullable<GateResult['materialLines']>[number]

const TAG_CLASS: Record<MaterialLineView['label'], string> = {
  'Còn hàng': styles.tagIn,
  'Dự kiến': styles.tagExpected,
  'Không có': styles.tagOut,
  'QC Hold': styles.tagHold,
}

type MaterialCheckRowProps = {
  line: MaterialLineView
}

export function MaterialCheckRow({ line }: MaterialCheckRowProps) {
  const tagClass = TAG_CLASS[line.label] ?? styles.tagOut

  return (
    <div className={styles.matRow}>
      <span className={styles.matCode}>{line.code}</span>
      <span className={`${styles.tag} ${tagClass}`}>[{line.label}]</span>
      <span className={styles.matNums}>Cần {line.required}</span>
      <span className={styles.matNums}>Khả dụng {line.available}</span>
      <span className={`${styles.matNums} ${styles.muted}`}>
        Tồn {line.onHand} · Giữ chỗ {line.reserved}
        {line.qcHold ? ' · QC hold' : ''}
      </span>
    </div>
  )
}
