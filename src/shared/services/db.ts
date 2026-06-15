import Dexie, { type Table } from 'dexie'
import { type Note } from '../../features/database/types'

const DB_NAME = 'kmp-showcase'
const DB_VERSION = 1

class AppDatabase extends Dexie {
  notes!: Table<Note>

  constructor() {
    super(DB_NAME)
    this.version(DB_VERSION).stores({
      notes: '++id, title, createdAt',
    })
  }
}

export const db = new AppDatabase()
