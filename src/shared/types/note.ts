/**
 * A note held on the server, as opposed to the Database screen's note held in IndexedDB.
 *
 * `etag` is carried verbatim from the response and sent back verbatim on a write. The quotes are part
 * of the value and `If-Match` compares strongly, so a client that trims or rebuilds it can never match.
 */
export interface RemoteNote {
  id: number
  title: string
  content: string
  createdAt: number
  updatedAt: number
  etag: string
}

export interface RemoteNoteInput {
  title: string
  content: string
}
