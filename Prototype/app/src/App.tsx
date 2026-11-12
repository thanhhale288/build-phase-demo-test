import { HashRouter } from 'react-router-dom'
import { AppChrome } from './components/layout/AppChrome.tsx'
import { AppRoutes } from './routes.tsx'

export default function App() {
  return (
    <HashRouter>
      <AppChrome>
        <AppRoutes />
      </AppChrome>
    </HashRouter>
  )
}
