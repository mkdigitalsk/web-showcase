import { queryOptions } from '@tanstack/react-query'
import { authService } from '../services'
import type { AuthUser } from '../types'

/**
 * Who is signed in, as the API answers it — `null` for nobody. The browser cannot read the session cookie, so
 * asking is the only way to know. It never goes stale on its own: signing in writes it, signing out clears the
 * cache, and a 401 elsewhere reloads the app.
 */
export const sessionQueryOptions = queryOptions({
  queryKey: ['session'],
  queryFn: (): Promise<AuthUser | null> => authService.session(),
  staleTime: Infinity,
})
