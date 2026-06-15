import { db } from '../../../shared/services/db'
import { type Note } from '../types'

export const noteRepository = {
  getAll: (): Promise<Note[]> =>
    db.notes.toArray(),

  filter: (predicate: (note: Note) => boolean): Promise<Note[]> =>
    db.notes.filter(predicate).toArray(),

  add: (note: Omit<Note, 'id'>): Promise<number> =>
    db.notes.add(note),

  delete: (id: number): Promise<void> =>
    db.notes.delete(id),

  clear: (): Promise<void> =>
    db.notes.clear(),
}
