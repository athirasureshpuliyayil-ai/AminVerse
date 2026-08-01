import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  const token = localStorage.getItem('animverse_token')
  const user = localStorage.getItem('animverse_user')
  return token && user ? <Outlet /> : <Navigate to="/login" replace />
}
