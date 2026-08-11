import { userApi } from '../api'
import type { ThemeMode } from '../types'

export const userService = {
  updateThemeMode: (themeMode: ThemeMode) => userApi.updateThemeMode(themeMode),
  updateLocale: (locale: string) => userApi.updateLocale(locale),
}
