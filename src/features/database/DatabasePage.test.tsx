import 'fake-indexeddb/auto'
import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderWithProviders, screen, userEvent, fakeNote, waitFor } from '../../test/test-utils'
import { db } from '../../shared/services/db'
import { noteService } from './service/noteService'
import { DatabasePage } from './DatabasePage'

// Drives the real feature stack (useLiveQuery -> noteService -> noteRepository -> Dexie)
// against a fake IndexedDB boundary — the web equivalent of faking a repository.
afterEach(async () => {
  await db.notes.clear()
})

describe('DatabasePage', () => {
  it('shows the empty state, then the note the user adds', async () => {
    renderWithProviders(<DatabasePage />)

    expect(await screen.findByText('No notes yet — add one above')).toBeVisible()

    await userEvent.type(screen.getByLabelText('Title'), 'Buy milk')
    await userEvent.type(screen.getByLabelText('Content'), 'Two litres')
    await userEvent.click(screen.getByRole('button', { name: 'Add Note' }))

    expect(await screen.findByText('Buy milk')).toBeVisible()
    expect(screen.getByText('Two litres')).toBeVisible()
    expect(screen.queryByText('No notes yet — add one above')).not.toBeInTheDocument()
  })

  it('filters the notes by the search query', async () => {
    await noteService.addNote('Apple pie', 'dessert')
    await noteService.addNote('Beef stew', 'dinner')
    renderWithProviders(<DatabasePage />)

    expect(await screen.findByText('Apple pie')).toBeVisible()

    await userEvent.type(screen.getByPlaceholderText('Search notes...'), 'apple')

    expect(await screen.findByText('Apple pie')).toBeVisible()
    await waitFor(() => expect(screen.queryByText('Beef stew')).not.toBeInTheDocument())
  })

  it('reorders the notes by the selected sort option', async () => {
    await db.notes.add(fakeNote({ title: 'Apple', createdAt: 1000 }))
    await db.notes.add(fakeNote({ title: 'Banana', createdAt: 2000 }))
    renderWithProviders(<DatabasePage />)

    // Default DATE_DESC — newest (Banana) precedes oldest (Apple).
    await screen.findByText('Banana')
    expect(precedes('Banana', 'Apple')).toBe(true)

    await userEvent.click(screen.getByTestId('FilterListIcon'))
    await userEvent.click(screen.getByRole('menuitem', { name: 'Title — A to Z' }))

    expect(precedes('Apple', 'Banana')).toBe(true)
  })

  it('deletes a single note', async () => {
    await noteService.addNote('Disposable', '')
    renderWithProviders(<DatabasePage />)

    await screen.findByText('Disposable')
    await userEvent.click(screen.getByTestId('DeleteIcon'))

    expect(await screen.findByText('No notes yet — add one above')).toBeVisible()
  })

  it('clears all notes', async () => {
    await noteService.addNote('One', '')
    await noteService.addNote('Two', '')
    renderWithProviders(<DatabasePage />)

    await screen.findByText('One')
    await userEvent.click(screen.getByRole('button', { name: 'Clear All Notes' }))

    expect(await screen.findByText('No notes yet — add one above')).toBeVisible()
  })

  it('surfaces an error when adding a note fails', async () => {
    vi.spyOn(noteService, 'addNote').mockRejectedValueOnce(new Error('db down'))
    renderWithProviders(<DatabasePage />)

    await userEvent.type(screen.getByLabelText('Title'), 'Doomed')
    await userEvent.click(screen.getByRole('button', { name: 'Add Note' }))

    expect(await screen.findByText('Failed to load notes')).toBeVisible()
  })
})

function precedes(first: string, second: string): boolean {
  const a = screen.getByText(first)
  const b = screen.getByText(second)
  return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
}
