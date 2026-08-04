import 'fake-indexeddb/auto'
import { describe, it, expect, afterEach } from 'vitest'
import { db } from '../../../shared/services/db'
import { noteService } from './noteService'

afterEach(async () => {
  await db.notes.clear()
})

describe('noteService', () => {
  it('adds a note with a creation timestamp and returns all notes', async () => {
    const before = Date.now()
    await noteService.addNote('Title', 'Body')

    const notes = await noteService.searchNotes('')
    expect(notes).toHaveLength(1)
    expect(notes[0]).toMatchObject({ title: 'Title', content: 'Body' })
    expect(notes[0]?.createdAt).toBeGreaterThanOrEqual(before)
  })

  it('filters case-insensitively across title and content', async () => {
    await noteService.addNote('Shopping', 'buy MILK')
    await noteService.addNote('Work', 'finish report')

    const milk = await noteService.searchNotes('milk')
    expect(milk).toHaveLength(1)
    expect(milk[0]?.title).toBe('Shopping')
    expect(await noteService.searchNotes('WORK')).toHaveLength(1)
    expect(await noteService.searchNotes('xyz')).toHaveLength(0)
  })

  it('treats a blank query as "all notes"', async () => {
    await noteService.addNote('One', '')
    await noteService.addNote('Two', '')

    expect(await noteService.searchNotes('   ')).toHaveLength(2)
  })

  it('deletes a single note by id', async () => {
    const id = await noteService.addNote('Doomed', '')
    await noteService.addNote('Keeper', '')

    await noteService.deleteNote(id)

    const notes = await noteService.searchNotes('')
    expect(notes).toHaveLength(1)
    expect(notes[0]?.title).toBe('Keeper')
  })

  it('clears every note', async () => {
    await noteService.addNote('One', '')
    await noteService.addNote('Two', '')

    await noteService.deleteAllNotes()

    expect(await noteService.searchNotes('')).toHaveLength(0)
  })
})
