import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
  const adminToken = localStorage.getItem('animverse_admin_token')
  const userToken  = localStorage.getItem('animverse_token')
  const user       = JSON.parse(localStorage.getItem('animverse_user') || 'null')

  const isAdmin = adminToken || (userToken && user?.role === 'admin')

  return isAdmin ? <Outlet /> : <Navigate to="/admin-login" replace />
}
