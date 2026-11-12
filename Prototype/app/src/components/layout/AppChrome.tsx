import { useState } from 'react'
import type { ReactNode } from 'react'
import { App, Button, Drawer, Layout, Menu, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  ExperimentOutlined,
  ProfileOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore.ts'
import { useResponsive } from '../../hooks/useResponsive.ts'
import { AlertBanner } from './AlertBanner.tsx'
import { Header } from './Header.tsx'
import { RoleSwitcher } from './RoleSwitcher.tsx'

const { Header: AntHeader, Sider, Content } = Layout

const ITEMS = [
  { key: '/dispatcher', icon: <DashboardOutlined />, label: 'Điều độ' },
  { key: '/lead', icon: <TeamOutlined />, label: 'Tổ trưởng' },
  { key: '/audit', icon: <ProfileOutlined />, label: 'Nhật ký' },
  { key: '/demo/stale-approve', icon: <ExperimentOutlined />, label: 'Demo duyệt stale' },
]

type AppChromeProps = { children: ReactNode }

export function AppChrome({ children }: AppChromeProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDesktop } = useResponsive()
  const [navOpen, setNavOpen] = useState(false)
  const resetSeed = useAppStore((s) => s.resetSeed)
  const { message } = App.useApp()
  const selected = location.pathname.startsWith('/wo/') ? '/dispatcher' : location.pathname

  function go(key: string) {
    navigate(key)
    setNavOpen(false)
  }

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selected]}
      items={ITEMS}
      onClick={({ key }) => go(key)}
    />
  )

  const brand = (
    <div style={{ padding: '16px 16px 12px', lineHeight: 1.3 }}>
      <Typography.Title level={5} style={{ margin: 0 }}>
        SmartWO
      </Typography.Title>
      <Typography.Text type="secondary">Điều độ lệnh (mô phỏng)</Typography.Text>
    </div>
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isDesktop ? (
        <Sider
          theme="light"
          width={220}
          style={{ borderRight: '1px solid #f0f0f0' }}
        >
          {brand}
          {menu}
        </Sider>
      ) : null}
      <Layout>
        <AntHeader style={{ paddingInline: isDesktop ? 16 : 8 }}>
          <Header isDesktop={isDesktop} onOpenNav={() => setNavOpen(true)} />
        </AntHeader>
        <AlertBanner />
        <Content style={{ padding: isDesktop ? 16 : 12, overflow: 'auto' }}>{children}</Content>
      </Layout>
      {isDesktop ? null : (
        <Drawer
          title="SmartWO (mô phỏng)"
          placement="left"
          open={navOpen}
          onClose={() => setNavOpen(false)}
          width={300}
          styles={{ body: { padding: 0 } }}
        >
          {menu}
          <Space direction="vertical" size={12} style={{ display: 'flex', padding: 16 }}>
            <Typography.Text type="secondary">Vai đang dùng</Typography.Text>
            <RoleSwitcher block />
            <Button
              block
              icon={<ReloadOutlined />}
              onClick={() => {
                resetSeed()
                message.success('Đã reset dữ liệu mô phỏng.')
                setNavOpen(false)
              }}
            >
              Reset Demo
            </Button>
          </Space>
        </Drawer>
      )}
    </Layout>
  )
}
