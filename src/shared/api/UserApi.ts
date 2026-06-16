import type { ThemeMode, User } from '../types'
import { BaseApiService } from './BaseApiService'

export class UserApi extends BaseApiService {
  protected readonly baseRoute = '/api/users'

  getUsers(): Promise<User[]> {
    return this._get<User[]>(this.baseRoute)
  }

  updateThemeMode(themeMode: ThemeMode): Promise<User> {
    return this._put<User>(`${this.baseRoute}/me/theme-mode`, { themeMode })
  }

  updateLocale(locale: string): Promise<User> {
    return this._put<User>(`${this.baseRoute}/me/locale`, { locale })
  }
}
