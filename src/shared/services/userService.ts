import { userApi } from '../api'
import type { ThemeMode } from '../types'

export const userService = {
  getUsers: () => userApi.getUsers(),
  updateThemeMode: (themeMode: ThemeMode) => userApi.updateThemeMode(themeMode),
  updateLocale: (locale: string) => userApi.updateLocale(locale),
}
