import type { ThemeMode } from './theme'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  email: string
  themeMode: ThemeMode
  locale: string
  demo: boolean
}

/** The API's token stays with the proxy as the session cookie; the page receives only who signed in. */
export interface AuthResponse {
  user: AuthUser
}
