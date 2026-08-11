import { authApi } from '../api'
import type { SignInRequest, SignUpRequest } from '../types'

export const authService = {
  signIn: (credentials: SignInRequest) => authApi.signIn(credentials),

  signUp: (data: SignUpRequest) => authApi.signUp(data),
}
