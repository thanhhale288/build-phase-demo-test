import { Segmented } from 'antd'
import { useAppStore } from '../../store/useAppStore.ts'
import type { Role } from '../../domain/types.ts'

type RoleSwitcherProps = { block?: boolean }

export function RoleSwitcher({ block }: RoleSwitcherProps) {
  const role = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)
  return (
    <Segmented<Role>
      aria-label="Chuyển vai"
      block={block}
      value={role}
      onChange={(value) => setRole(value)}
      options={[
        { label: 'Điều độ viên', value: 'dispatcher' },
        { label: 'Tổ trưởng chuyền', value: 'line_lead' },
      ]}
    />
  )
}
