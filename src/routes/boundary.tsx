import { RouteError } from '../shared/components'

/** A crashed page renders inside its layout, so the chrome around it goes on working. */
export function ErrorBoundary() {
  return <RouteError />
}
