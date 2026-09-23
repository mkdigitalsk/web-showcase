import { QueryClient } from '@tanstack/react-query'

/**
 * The one cache: a route's `clientLoader` fills it before the page renders, and the page reads the same entry.
 * A module singleton is safe here — with no server rendering, one browser tab is its only user.
 */
export const queryClient = new QueryClient()
