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
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
