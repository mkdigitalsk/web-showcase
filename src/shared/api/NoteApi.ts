import type { RemoteNote, RemoteNoteInput } from '../types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

export class NoteApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/notes`

  getNotes(): Promise<RemoteNote[]> {
    return this._get<RemoteNote[]>(this.baseRoute)
  }

  createNote(input: RemoteNoteInput): Promise<RemoteNote> {
    return this._post<RemoteNote>(this.baseRoute, input)
  }

  // The server refuses a write that names no version, so the tag is required rather than optional —
  // an edit that could not capture one has nothing to send and must not be attempted.
  updateNote(id: number, input: RemoteNoteInput, etag: string): Promise<RemoteNote> {
    return this._put<RemoteNote>(`${this.baseRoute}/${id}`, input, { headers: { 'If-Match': etag } })
  }

  deleteNote(id: number): Promise<void> {
    return this._delete<void>(`${this.baseRoute}/${id}`)
  }
}
