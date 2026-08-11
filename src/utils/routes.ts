type ParamRoute<P extends Record<string, string | number>> = { path: string; withArgs: (params: P) => string }

export function paramRoute<P extends Record<string, string | number>>(
  path: string,
  builder: (params: P) => string,
): ParamRoute<P> {
  return { path, withArgs: builder }
}

export const Routes = {
  ROOT: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  PRIVACY: '/privacy',
  NETWORKING: '/networking',
  STORAGE: '/storage',
  DATABASE: '/database',
  UI_COMPONENTS: '/ui-components',
  CAPABILITIES: '/capabilities',
  ACCOUNT: '/account',
} as const

// Every path the app serves, as a type. A component that takes this instead of `string` cannot be
// handed a route the router never registered.
export type AppRoute = (typeof Routes)[keyof typeof Routes]
