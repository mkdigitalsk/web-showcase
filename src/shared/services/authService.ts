import { api } from './api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', data)
    return response.data
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token')
  },
}
