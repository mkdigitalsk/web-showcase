import Dexie, { type EntityTable } from 'dexie'
import type { Note } from '../types'

const DB_NAME = 'kmp-showcase'
const DB_VERSION = 1

class AppDatabase extends Dexie {
  notes!: EntityTable<Note, 'id'>

  constructor() {
    super(DB_NAME)
    this.version(DB_VERSION).stores({
      notes: '++id, title, createdAt',
    })
  }
}

export const db = new AppDatabase()
