import { noteRepository } from '../repository/noteRepository'
import { type Note } from '../types'

export const noteService = {
  addNote: (title: string, content: string): Promise<number> =>
    noteRepository.add({ title, content, createdAt: Date.now() }),

  deleteNote: (id: number): Promise<void> =>
    noteRepository.delete(id),

  deleteAllNotes: (): Promise<void> =>
    noteRepository.clear(),

  searchNotes: (query: string): Promise<Note[]> => {
    if (!query.trim()) return noteRepository.getAll()
    const lower = query.toLowerCase()
    return noteRepository.filter(
      (n) => n.title.toLowerCase().includes(lower) || n.content.toLowerCase().includes(lower),
    )
  },
}
