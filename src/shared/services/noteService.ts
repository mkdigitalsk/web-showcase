import { noteApi } from '../api'
import type { RemoteNoteInput } from '../types'

export const noteService = {
  getNotes: () => noteApi.getNotes(),
  createNote: (input: RemoteNoteInput) => noteApi.createNote(input),
  updateNote: (id: number, input: RemoteNoteInput, etag: string) => noteApi.updateNote(id, input, etag),
  deleteNote: (id: number) => noteApi.deleteNote(id),
}
