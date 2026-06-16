import type { ThemeMode } from './theme'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthUser {
  id: number
  email: string
  name: string
  themeMode: ThemeMode
  locale: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}
