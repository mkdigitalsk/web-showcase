import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout, LoadingView, PrivateRoute, PublicLayout } from './shared/components'
import { Routes as AppRoutes } from './utils'

// One chunk per route: a visitor landing on SignIn pays for SignIn, not for every screen behind the gate.
const PrivacyPage = lazy(() => import('./features/privacy/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const SignInPage = lazy(() => import('./features/auth/signIn/SignInPage').then((m) => ({ default: m.SignInPage })))
const SignUpPage = lazy(() => import('./features/auth/signUp/SignUpPage').then((m) => ({ default: m.SignUpPage })))
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
const AccountPage = lazy(() => import('./features/account/AccountPage').then((m) => ({ default: m.AccountPage })))

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingView sx={{ minHeight: '100vh' }} />}>
      <Routes>
        <Route path={AppRoutes.ROOT} element={<Navigate to={AppRoutes.UI_COMPONENTS} replace />} />
        <Route element={<PublicLayout />}>
          <Route path={AppRoutes.SIGN_IN} element={<SignInPage />} />
          <Route path={AppRoutes.SIGN_UP} element={<SignUpPage />} />
          <Route path={AppRoutes.PRIVACY} element={<PrivacyPage />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path={AppRoutes.NETWORKING} element={<NetworkingPage />} />
            <Route path={AppRoutes.STORAGE} element={<StoragePage />} />
            <Route path={AppRoutes.DATABASE} element={<DatabasePage />} />
            <Route path={AppRoutes.UI_COMPONENTS} element={<UiComponentsPage />} />
            <Route path={AppRoutes.CAPABILITIES} element={<CapabilitiesPage />} />
            <Route path={AppRoutes.ACCOUNT} element={<AccountPage />} />
          </Route>
        </Route>
        {/* Without this an unmatched path renders nothing, which reads as a crash rather than a typo. */}
        <Route path="*" element={<Navigate to={AppRoutes.ROOT} replace />} />
      </Routes>
    </Suspense>
  )
}
