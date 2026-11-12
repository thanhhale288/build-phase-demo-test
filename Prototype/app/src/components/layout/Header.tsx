import { App, Button, Typography } from 'antd'
import { MenuOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAppStore } from '../../store/useAppStore.ts'
import { RoleSwitcher } from './RoleSwitcher.tsx'

type HeaderProps = {
  isDesktop: boolean
  onOpenNav?: () => void
}

export function Header({ isDesktop, onOpenNav }: HeaderProps) {
  const resetSeed = useAppStore((s) => s.resetSeed)
  const { message } = App.useApp()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: '100%',
        width: '100%',
        minWidth: 0,
      }}
    >
      {isDesktop ? null : (
        <Button
          type="text"
          icon={<MenuOutlined />}
          aria-label="Mở menu điều hướng"
          onClick={onOpenNav}
        />
      )}
      <Typography.Text
        strong
        style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {isDesktop ? 'SmartWO — công cụ điều độ nội bộ' : 'SmartWO'}
      </Typography.Text>
      {isDesktop ? (
        <>
          <RoleSwitcher />
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              resetSeed()
              message.success('Đã reset dữ liệu mô phỏng.')
            }}
          >
            Reset Demo
          </Button>
        </>
      ) : null}
    </div>
  )
}
