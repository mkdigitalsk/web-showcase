import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { theme } from './shared/theme'
import { AppLayout, PrivateRoute } from './shared/components'
import { AuthProvider, LocaleProvider } from './shared/context'
import { LoginPage } from './features/auth/login/LoginPage'
import { RegisterPage } from './features/auth/register/RegisterPage'
import { HomePage } from './features/home/HomePage'
import { NetworkingPage } from './features/networking/NetworkingPage'
import { StoragePage } from './features/storage/StoragePage'
import { DatabasePage } from './features/database/DatabasePage'
import { UiComponentsPage } from './features/ui-components/UiComponentsPage'
import { CapabilitiesPage } from './features/capabilities/CapabilitiesPage'
import { Routes as AppRoutes } from './utils'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <LocaleProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to={AppRoutes.HOME} replace />} />
                <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
                <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
                <Route element={<PrivateRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path={AppRoutes.HOME} element={<HomePage />} />
                    <Route path={AppRoutes.NETWORKING} element={<NetworkingPage />} />
                    <Route path={AppRoutes.STORAGE} element={<StoragePage />} />
                    <Route path={AppRoutes.DATABASE} element={<DatabasePage />} />
                    <Route path={AppRoutes.UI_COMPONENTS} element={<UiComponentsPage />} />
                    <Route path={AppRoutes.CAPABILITIES} element={<CapabilitiesPage />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LocaleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
