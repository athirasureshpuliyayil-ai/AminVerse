import { useState } from 'react'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'

export default function AppShell({ title, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      background: '#0A0B0E',
      color: '#F8FAFC'
    }}>
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, background: '#0A0B0E' }}>
        <AppHeader title={title} />
        <main style={{ flex: 1, padding: '28px 36px', overflowY: 'auto', background: '#0A0B0E' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
