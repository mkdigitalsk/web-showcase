import enMessages from '../../locales/en.json'
import { Locale } from '../enums/locale'

export interface LocaleOption {
  code: Locale
  label: string
  flag: string // emoji flag (swap to SVG lib if Windows rendering matters)
}

export const LOCALES: LocaleOption[] = [
  { code: Locale.EN_GB, label: 'English', flag: '🇬🇧' },
]

export const MESSAGES: Record<string, Record<string, string>> = {
  [Locale.EN_GB]: enMessages,
}

export const DEFAULT_LOCALE: Locale = Locale.EN_GB

export function messagesFor(locale: Locale): Record<string, string> {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE]
}
