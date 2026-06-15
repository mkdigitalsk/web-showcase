import { useLiveQuery } from 'dexie-react-hooks'
import { useState } from 'react'
import { noteService } from '../service/noteService'
import { type Note } from '../types'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('DATE_DESC')

  const notes = useLiveQuery(
    () => noteService.searchNotes(searchQuery).then((result) => sortNotes(result, sortOption)),
    [searchQuery, sortOption],
  )

  const resolvedNotes = notes ?? []

  return {
    notes: resolvedNotes,
    isLoading: notes === undefined,
    isEmpty: notes !== undefined && resolvedNotes.length === 0,
    hasNotes: resolvedNotes.length > 0,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    addNote: noteService.addNote,
    deleteNote: noteService.deleteNote,
    deleteAllNotes: noteService.deleteAllNotes,
  }
}
