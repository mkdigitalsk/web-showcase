import type { ReactNode } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import '@fontsource/archivo/400.css'
import '@fontsource/archivo/500.css'
import '@fontsource/archivo/700.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'

import { ConsentDialog } from './shared/analytics/ConsentDialog'
import { ErrorTracking } from './shared/analytics/ErrorTracking'
import { Measurement } from './shared/analytics/Measurement'
import { queryClient } from './shared/api/queryClient'
import { RouteError, SnackbarProvider, TooltipProvider } from './shared/components'
import {
  AuthProvider,
  ColorSchemeProvider,
  ConsentProvider,
  LocaleProvider,
  THEME_MODE_STORAGE_KEY,
} from './shared/context'
import './shared/theme/tokens.css'
import './index.css'

/**
 * Sets the stored mode on <html> before the first paint, so a page chosen dark never flashes light. It reads the
 * ColorSchemeProvider's key as the provider wrote it, JSON-encoded; anything else leaves the system's scheme.
 */
const THEME_SCRIPT = `try{var m=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_MODE_STORAGE_KEY)}));if(m==='light'||m==='dark')document.documentElement.dataset.theme=m}catch(e){}`

/**
 * The document. It renders once at build time into `index.html`, so nothing in it may touch a browser API; the
 * theme script above runs in the browser alone, and <html> suppresses the attribute it adds there.
 */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <div id="app">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

/**
 * Every provider a screen reads — the scheme, the tooltips' shared timing, the language, the consent, the notices.
 */
function Chrome({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <TooltipProvider>
        <LocaleProvider>
          <ConsentProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </ConsentProvider>
        </LocaleProvider>
      </TooltipProvider>
    </ColorSchemeProvider>
  )
}

/** Every page, then the consent dialog, and the measurement and error recording the answers allow. */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Chrome>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <ConsentDialog />
        <Measurement />
        <ErrorTracking />
      </Chrome>
    </QueryClientProvider>
  )
}

/** What `index.html` shows until the app and its first loaders are ready — plain markup on the global tokens. */
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
