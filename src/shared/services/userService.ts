import { userApi } from '../api'
import type { Language, ThemeMode } from '../types'

export const userService = {
  updateThemeMode: (themeMode: ThemeMode) => userApi.updateThemeMode(themeMode),
  updateLanguage: (language: Language) => userApi.updateLanguage(language),
  deleteAccount: () => userApi.deleteAccount(),
}
