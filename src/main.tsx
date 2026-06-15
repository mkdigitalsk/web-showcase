import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { IntlProvider } from 'react-intl'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { theme } from './shared/theme'
import { PrivateRoute } from './shared/components'
import { AuthProvider } from './shared/context'
import { LoginPage } from './features/auth/login/LoginPage'
import { RegisterPage } from './features/auth/register/RegisterPage'
import { HomePage } from './features/home/HomePage'
import { Routes as AppRoutes } from './utils'
import messages from './locales/en.json'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IntlProvider locale="en" messages={messages}>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to={AppRoutes.HOME} replace />} />
                <Route path={AppRoutes.LOGIN} element={<LoginPage />} />
                <Route path={AppRoutes.REGISTER} element={<RegisterPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path={AppRoutes.HOME} element={<HomePage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </IntlProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
