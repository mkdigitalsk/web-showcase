export const StorageKey = {
  SESSION_COUNTER: 'storage.sessionCounter',
  PERSISTENT_COUNTER: 'storage.persistentCounter',
} as const

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey]
