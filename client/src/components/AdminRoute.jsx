import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
  const adminToken = localStorage.getItem('animverse_admin_token')
  const admin      = localStorage.getItem('animverse_admin')

  return adminToken && admin ? <Outlet /> : <Navigate to="/admin-login" replace />
}
