export const Locale = {
  EN_GB: 'en-GB',
  SK_SK: 'sk-SK',
  CS_CZ: 'cs-CZ',
  DE_DE: 'de-DE',
} as const

// Predefined locales give autocomplete; the `| (string & {})` keeps the type
// OPEN so future dynamic / AI-translated locales are added without changing it.
export type Locale = (typeof Locale)[keyof typeof Locale] | (string & {})
