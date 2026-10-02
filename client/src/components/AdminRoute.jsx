import { Navigate, Outlet } from 'react-router-dom'
import { getAdminToken, getAdminUser } from '../utils/authStorage'

export default function AdminRoute() {
  const adminToken = getAdminToken()
  const admin      = getAdminUser()

  return adminToken && admin ? <Outlet /> : <Navigate to="/admin-login" replace />
}
