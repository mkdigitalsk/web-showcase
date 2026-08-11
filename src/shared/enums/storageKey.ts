export const StorageKey = {
  TOKEN: 'token',
  USER: 'user',
  SESSION_COUNTER: 'storage.sessionCounter',
  PERSISTENT_COUNTER: 'storage.persistentCounter',
} as const

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey]
