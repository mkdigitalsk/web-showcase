import type { ThemeMode } from './theme'

export interface User {
  id: number
  email: string
  createdAt: number
  themeMode: ThemeMode
  locale: string
  demo: boolean
}
