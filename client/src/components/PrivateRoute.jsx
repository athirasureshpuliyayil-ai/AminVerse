import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { getToken, getUser } from '../utils/authStorage'

export default function PrivateRoute() {
  const token = getToken()
  const user = getUser()
  const location = useLocation()
  return token && user ? <Outlet /> : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
}

