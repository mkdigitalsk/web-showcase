type ParamRoute<P extends Record<string, string | number>> = { path: string; withArgs: (params: P) => string }

export function paramRoute<P extends Record<string, string | number>>(
  path: string,
  builder: (params: P) => string,
): ParamRoute<P> {
  return { path, withArgs: builder }
}

export const Routes = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
} as const
