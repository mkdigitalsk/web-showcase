import { openDB } from 'idb'

const DB_NAME = 'kmp-showcase'
const STORE = 'notes'
const DB_VERSION = 1

export interface Note {
  id?: number
  title: string
  content: string
  createdAt: number
}

function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDb()
  return db.getAll(STORE)
}

export async function addNote(title: string, content: string): Promise<void> {
  const db = await getDb()
  await db.add(STORE, { title, content, createdAt: Date.now() })
}

export async function deleteNote(id: number): Promise<void> {
  const db = await getDb()
  await db.delete(STORE, id)
}

export async function deleteAllNotes(): Promise<void> {
  const db = await getDb()
  await db.clear(STORE)
}
