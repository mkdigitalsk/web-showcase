import type { QueryClient } from '@tanstack/react-query'
import { StorageKey } from '../enums/storageKey'
import { db } from './db'

/**
 * Empties the table rather than dropping the database: `db.delete()` strands the Dexie singleton and
 * every live query already subscribed to it. A refusal is swallowed so the caller's other removals go
 * on: signed in is worse than notes left behind.
 */
const emptyNotesTable = () => db.notes.clear().catch(() => undefined)

/** Theme is the account's here, not the device's, so signOut resets it rather than this clearing it. */
export async function clearLocalUserData(queryClient: QueryClient): Promise<void> {
  await emptyNotesTable()
  queryClient.clear()
  localStorage.removeItem(StorageKey.PERSISTENT_COUNTER)
  sessionStorage.removeItem(StorageKey.SESSION_COUNTER)
  localStorage.removeItem(StorageKey.USER)
  localStorage.removeItem(StorageKey.TOKEN)
}
