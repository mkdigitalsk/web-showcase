import { authApi } from '../api'
import type { LoginRequest, RegisterRequest } from '../types'

export const authService = {
  login: (credentials: LoginRequest) => authApi.login(credentials),

  register: (data: RegisterRequest) => authApi.register(data),

  logout: (): Promise<void> => {
    localStorage.removeItem('token')
    return Promise.resolve()
  },
}
