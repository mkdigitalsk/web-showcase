import type { AuthResponse, SignInRequest, SignUpRequest } from '../types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

export class AuthApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/auth`

  signIn(credentials: SignInRequest): Promise<AuthResponse> {
    return this._post<AuthResponse>(`${this.baseRoute}/sign-in`, credentials)
  }

  signUp(data: SignUpRequest): Promise<AuthResponse> {
    return this._post<AuthResponse>(`${this.baseRoute}/sign-up`, data)
  }

  /** Answered by the proxy, not the API: it expires the session cookie no script can reach. */
  signOut(): Promise<void> {
    return this._post<void>(`${this.baseRoute}/sign-out`)
  }
}
