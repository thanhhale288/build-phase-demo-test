import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as AntdApp, ConfigProvider } from 'antd'
import viVN from 'antd/es/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { smartwoTheme } from './theme/smartwoTheme.ts'
import './styles/global.css'
import App from './App.tsx'

dayjs.locale('vi')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={viVN} theme={smartwoTheme} componentSize="middle">
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
