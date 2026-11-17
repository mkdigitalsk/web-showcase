import type { components } from '../api/generated/schema'

/** The account's language, by the key the API keeps it under. */
export type Language = components['schemas']['UpdateLanguageRequestDTO']['language']
