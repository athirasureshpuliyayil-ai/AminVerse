import { useState } from 'react'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'

export default function AppShell({ title, children }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      fontFamily: "'Poppins', -apple-system, sans-serif",
      background: '#F9FAFB',
    }}>
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <AppHeader title={title} />
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
