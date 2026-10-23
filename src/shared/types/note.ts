import type { components } from '../api/generated/schema'

type S = components['schemas']

/** A note held in IndexedDB on this device, never sent to the server. */
export interface Note {
  id: number
  title: string
  content: string
  createdAt: number
}

/**
 * A note held on the server, as opposed to a {@link Note} held in IndexedDB.
 *
 * `etag` is carried verbatim from the response and sent back verbatim on a write. The quotes are part
 * of the value and `If-Match` compares strongly, so a client that trims or rebuilds it can never match.
 */
export type RemoteNote = S['NoteResponseDTO']

/** One value both the create and the update accept. */
export type RemoteNoteInput = S['CreateNoteRequestDTO'] & S['UpdateNoteRequestDTO']
