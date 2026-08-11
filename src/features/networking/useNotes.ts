import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { httpStatus } from '../../shared/api'
import { noteService } from '../../shared/services'
import type { RemoteNote, RemoteNoteInput } from '../../shared/types'

const NOTES_KEY = ['notes']

export const notesQueryOptions = queryOptions({
  queryKey: NOTES_KEY,
  queryFn: () => noteService.getNotes(),
})

export function useNotesQuery() {
  return useQuery(notesQueryOptions)
}

const CONFLICT = 412

/**
 * The row as the server actually holds it, when our write was refused for naming a stale version.
 * It travels in the 412 body precisely so the person can be shown both and choose — never so we can
 * merge on their behalf, which would silently pick a winner.
 */
export function conflictingNote(error: unknown): RemoteNote | undefined {
  if (httpStatus(error) !== CONFLICT) return undefined
  const body: unknown = (error as { response?: { data?: unknown } }).response?.data
  return body as RemoteNote
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: RemoteNoteInput) => noteService.createNote(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input, etag }: { id: number; input: RemoteNoteInput; etag: string }) =>
      noteService.updateNote(id, input, etag),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => noteService.deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTES_KEY }),
  })
}
