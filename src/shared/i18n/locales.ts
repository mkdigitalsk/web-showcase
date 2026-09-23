import enMessages from '../../locales/en.json'
import skMessages from '../../locales/sk.json'
import csMessages from '../../locales/cs.json'
import deMessages from '../../locales/de.json'
import { Locale } from '../enums/locale'

export interface LocaleOption {
  code: Locale
  label: string
  /** An emoji flag; swap to an SVG library if Windows rendering matters. */
  flag: string
}

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

/**
 * English underneath every locale: the privacy notice is deliberately only Slovak and English, so a
 * Czech or German reader gets the English text rather than a raw message id. Not DEFAULT_LOCALE — that
 * is the same open-key lookup and can miss in turn.
 */
export function messagesFor(locale: Locale): Record<string, string> {
  return { ...enMessages, ...(MESSAGES[locale] ?? {}) }
}
