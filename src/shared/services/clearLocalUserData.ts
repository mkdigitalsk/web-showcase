import type { QueryClient } from '@tanstack/react-query'
import { StorageKey } from '../enums/storageKey'
import { db } from './db'

/** Theme mode stays: it describes the device, not whoever was using it. */
export async function clearLocalUserData(queryClient: QueryClient): Promise<void> {
  // Emptying the table rather than dropping the database: `db.delete()` strands the Dexie singleton
  // and every live query already subscribed to it.
  //
  // A refusal here must not stop the removals below: signed in is worse than notes left behind.
  await db.notes.clear().catch(() => undefined)
  queryClient.clear()
  localStorage.removeItem(StorageKey.PERSISTENT_COUNTER)
  sessionStorage.removeItem(StorageKey.SESSION_COUNTER)
  localStorage.removeItem(StorageKey.USER)
  localStorage.removeItem(StorageKey.TOKEN)
}
