import type { ReactNode } from 'react'
import { AlertBanner } from './AlertBanner.tsx'
import { Header } from './Header.tsx'
import styles from './layout.module.css'

type AppChromeProps = { children: ReactNode }

export function AppChrome({ children }: AppChromeProps) {
  return (
    <div className={styles.chrome}>
      <Header />
      <AlertBanner />
      <div className={styles.chromeMain}>{children}</div>
    </div>
  )
}
