import { Navigate, Route, Routes } from 'react-router-dom'
import { DispatcherPage } from './pages/DispatcherPage.tsx'
import { LeadPage } from './pages/LeadPage.tsx'
import { AuditPage } from './pages/AuditPage.tsx'
import { DemoStalePage } from './pages/DemoStalePage.tsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dispatcher" replace />} />
      <Route path="/dispatcher" element={<DispatcherPage />} />
      <Route path="/wo/:woId" element={<DispatcherPage />} />
      <Route path="/lead" element={<LeadPage />} />
      <Route path="/audit" element={<AuditPage />} />
      <Route path="/demo/stale-approve" element={<DemoStalePage />} />
    </Routes>
  )
}
