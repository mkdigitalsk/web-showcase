import enMessages from '../../locales/en.json'
import skMessages from '../../locales/sk.json'
import csMessages from '../../locales/cs.json'
import deMessages from '../../locales/de.json'
import { Locale } from '../enums/locale'

export interface LocaleOption {
  code: Locale
  label: string
  flag: string // emoji flag (swap to SVG lib if Windows rendering matters)
}

// Labels are in each language's own form (endonyms) — conventional for switchers.
export const LOCALES: LocaleOption[] = [
  { code: Locale.EN_GB, label: 'English', flag: '🇬🇧' },
  { code: Locale.SK_SK, label: 'Slovenčina', flag: '🇸🇰' },
  { code: Locale.CS_CZ, label: 'Čeština', flag: '🇨🇿' },
  { code: Locale.DE_DE, label: 'Deutsch', flag: '🇩🇪' },
]

export const MESSAGES: Record<string, Record<string, string>> = {
  [Locale.EN_GB]: enMessages,
  [Locale.SK_SK]: skMessages,
  [Locale.CS_CZ]: csMessages,
  [Locale.DE_DE]: deMessages,
}

export const DEFAULT_LOCALE: Locale = Locale.EN_GB

export function messagesFor(locale: Locale): Record<string, string> {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE]
}
