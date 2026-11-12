import type { ThemeConfig } from 'antd'
import { theme } from 'antd'

export const smartwoTheme: ThemeConfig = {
  algorithm: theme.compactAlgorithm,
  token: {
    colorPrimary: '#1668DC',
    colorSuccess: '#198754',
    colorError: '#DC3545',
    colorWarning: '#F59E0B',
    colorBgLayout: '#F5F7FA',
    colorText: '#1F2328',
    borderRadius: 6,
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 56,
      headerPadding: '0 16px',
      siderBg: '#ffffff',
      lightSiderBg: '#ffffff',
      bodyBg: '#F5F7FA',
    },
  },
}
