import type { ThemeMode, User } from '../types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

const HTTP_OK = 200
const HTTP_UNAUTHORIZED = 401

export class UserApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/users`

  /**
   * Who the session cookie belongs to, or `null` without one. The 401 is accepted as an answer here, so it never
   * reaches the interceptor that reads a 401 as an expired session.
   */
  async me(): Promise<User | null> {
    const response = await this.http.get<User>(`${this.baseRoute}/me`, {
      validateStatus: (status) => status === HTTP_OK || status === HTTP_UNAUTHORIZED,
    })
    return response.status === HTTP_OK ? response.data : null
  }

  updateThemeMode(themeMode: ThemeMode): Promise<User> {
    return this._put<User>(`${this.baseRoute}/me/theme-mode`, { themeMode })
  }

  updateLocale(locale: string): Promise<User> {
    return this._put<User>(`${this.baseRoute}/me/locale`, { locale })
  }

  deleteAccount(): Promise<void> {
    return this._delete<void>(`${this.baseRoute}/me`)
  }
}
