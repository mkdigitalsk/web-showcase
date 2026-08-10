import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks'
import { Routes } from '../../utils'

export function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={Routes.SIGN_IN} state={{ from: location }} replace />
  }

  return <Outlet />
}
