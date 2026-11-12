import { Alert, Space } from 'antd'
import { useAppStore } from '../../store/useAppStore.ts'
import { useResponsive } from '../../hooks/useResponsive.ts'

export function AlertBanner() {
  const machines = useAppStore((s) => s.machines)
  const workOrders = useAppStore((s) => s.workOrders)
  const { isDesktop } = useResponsive()
  const alerts = machines.filter((m) => m.status === 'DOWN' || m.status === 'MAINTENANCE')
  if (alerts.length === 0) return null
  return (
    <div style={{ padding: isDesktop ? '8px 16px 0' : '8px 12px 0' }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        {alerts.map((machine) => {
          const affected = workOrders.filter((wo) => wo.machine_id === machine.machine_id)
          const isDown = machine.status === 'DOWN'
          return (
            <Alert
              key={machine.machine_id}
              type={isDown ? 'error' : 'warning'}
              showIcon
              message={`Máy ${machine.machine_id} — ${machine.name} đang ${isDown ? 'dừng (DOWN)' : 'bảo trì (MAINTENANCE)'}. Không đề xuất đổi máy.`}
              description={
                affected.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {affected.map((wo) => (
                      <li key={wo.wo_id}>
                        Lệnh bị ảnh hưởng: {wo.wo_id} ({wo.state})
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Không có lệnh đang gán máy này trong seed hiện tại.'
                )
              }
            />
          )
        })}
      </Space>
    </div>
  )
}
