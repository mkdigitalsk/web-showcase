import type { ReactNode } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/800.css'

import { queryClient } from './shared/api/queryClient'
import { RouteError } from './shared/components'
import { AuthProvider, LocaleProvider } from './shared/context'
import { theme } from './shared/theme'
import './index.css'

/** The document. It renders once at build time into `index.html`, so nothing in it may touch a browser API. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0E2A47" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Web Showcase</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function Chrome({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <LocaleProvider>{children}</LocaleProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Chrome>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </Chrome>
    </QueryClientProvider>
  )
}

/**
 * What `index.html` shows until the app and its first loaders are ready — plain markup, since no theme exists
 * before hydration and emotion's build-time styles would not survive it.
 */
export function HydrateFallback() {
  return <div className="app-loading" aria-busy="true" />
}

/** The last boundary, for a crash in a layout, the session check or a provider; each page has its own. */
export function ErrorBoundary() {
  return (
    <Chrome>
      <RouteError />
    </Chrome>
  )
}
