import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
  const token = localStorage.getItem('animverse_admin_token')
  const admin = localStorage.getItem('animverse_admin')
  return token && admin ? <Outlet /> : <Navigate to="/admin-login" replace />
}
