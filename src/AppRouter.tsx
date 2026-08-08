import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout, LoadingView, PrivateRoute } from './shared/components'
import { Routes as AppRoutes } from './utils'

// One chunk per route: a visitor landing on Login pays for Login, not for every screen behind the gate.
const LoginPage = lazy(() => import('./features/auth/login/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('./features/auth/register/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const NetworkingPage = lazy(() =>
  import('./features/networking/NetworkingPage').then((m) => ({ default: m.NetworkingPage })),
)
const StoragePage = lazy(() => import('./features/storage/StoragePage').then((m) => ({ default: m.StoragePage })))
const DatabasePage = lazy(() => import('./features/database/DatabasePage').then((m) => ({ default: m.DatabasePage })))
const UiComponentsPage = lazy(() =>
  import('./features/ui-components/UiComponentsPage').then((m) => ({ default: m.UiComponentsPage })),
)
const CapabilitiesPage = lazy(() =>
  import('./features/capabilities/CapabilitiesPage').then((m) => ({ default: m.CapabilitiesPage })),
)

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingView sx={{ minHeight: '100vh' }} />}>
      <Routes>
        <Route path="/" element={<Navigate to={AppRoutes.UI_COMPONENTS} replace />} />
        <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
        <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path={AppRoutes.NETWORKING} element={<NetworkingPage />} />
            <Route path={AppRoutes.STORAGE} element={<StoragePage />} />
            <Route path={AppRoutes.DATABASE} element={<DatabasePage />} />
            <Route path={AppRoutes.UI_COMPONENTS} element={<UiComponentsPage />} />
            <Route path={AppRoutes.CAPABILITIES} element={<CapabilitiesPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
