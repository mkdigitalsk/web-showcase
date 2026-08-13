import type { ReactNode } from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { useLocation } from 'react-router-dom'
import { RouteError } from './RouteError'

/**
 * A crashed route, kept inside its layout — the chrome around it goes on rendering.
 *
 * `errorElement` belongs to a data router; this app routes declaratively, so the boundary is a component
 * ([TanStack — QueryErrorResetBoundary](https://tanstack.com/query/latest/docs/framework/react/reference/QueryErrorResetBoundary)).
 * `reset` clears the query errors a retry would otherwise re-throw, and the path in `resetKeys` clears the
 * boundary on navigation, so a crash on one route does not follow the user to the next.
 */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={RouteError} onReset={reset} resetKeys={[pathname]}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
