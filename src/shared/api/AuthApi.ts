import type { AuthResponse, LoginRequest, RegisterRequest } from '../types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

export class AuthApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/auth`

  login(credentials: LoginRequest): Promise<AuthResponse> {
    return this._post<AuthResponse>(`${this.baseRoute}/login`, credentials)
  }

  register(data: RegisterRequest): Promise<AuthResponse> {
    return this._post<AuthResponse>(`${this.baseRoute}/register`, data)
  }
}
