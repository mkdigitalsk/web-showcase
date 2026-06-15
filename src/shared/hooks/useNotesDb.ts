import { useCallback, useEffect, useState } from 'react'
import { type Note, addNote, deleteAllNotes, deleteNote, getAllNotes } from '../services/noteDb'

export type SortOption = 'DATE_DESC' | 'DATE_ASC' | 'TITLE_ASC' | 'TITLE_DESC'

function sortNotes(notes: Note[], option: SortOption): Note[] {
  return [...notes].sort((a, b) => {
    switch (option) {
      case 'DATE_DESC': return b.createdAt - a.createdAt
      case 'DATE_ASC': return a.createdAt - b.createdAt
      case 'TITLE_ASC': return a.title.localeCompare(b.title)
      case 'TITLE_DESC': return b.title.localeCompare(a.title)
    }
  })
}

export function useNotesDb() {
  const [allNotes, setAllNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('DATE_DESC')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotes = useCallback(async () => {
    try {
      const notes = await getAllNotes()
      setAllNotes(notes)
      setError(null)
    } catch {
      setError('Failed to load notes')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { void loadNotes() }, [loadNotes])

  const notes = sortNotes(
    allNotes.filter((n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    sortOption,
  )

  const handleAddNote = useCallback(async (title: string, content: string) => {
    await addNote(title, content)
    await loadNotes()
  }, [loadNotes])

  const handleDeleteNote = useCallback(async (id: number) => {
    await deleteNote(id)
    await loadNotes()
  }, [loadNotes])

  const handleDeleteAllNotes = useCallback(async () => {
    await deleteAllNotes()
    await loadNotes()
  }, [loadNotes])

  return {
    notes,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    isLoading,
    error,
    addNote: handleAddNote,
    deleteNote: handleDeleteNote,
    deleteAllNotes: handleDeleteAllNotes,
  }
}
