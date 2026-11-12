import { Grid } from 'antd'

export function useResponsive() {
  const screens = Grid.useBreakpoint()
  const isDesktop = !!screens.lg
  const isMobile = !screens.md
  const isTablet = !!screens.md && !screens.lg
  return { screens, isDesktop, isMobile, isTablet }
}
