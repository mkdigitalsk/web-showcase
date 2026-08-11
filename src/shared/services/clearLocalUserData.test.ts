import 'fake-indexeddb/auto'
import { QueryClient } from '@tanstack/react-query'
import { describe, it, expect, afterEach } from 'vitest'
import { fakeAuthUser, fakeNote, fakeRemoteNote } from '../../test/test-utils'
import { StorageKey } from '../enums/storageKey'
import { clearLocalUserData } from './clearLocalUserData'
import { db } from './db'

const THEME_MODE_KEY = 'mui-mode'
const NOTES_QUERY_KEY = ['notes']

afterEach(async () => {
  await db.notes.clear()
})

describe('clearLocalUserData', () => {
  it('empties every store the signed-in person filled', async () => {
    const queryClient = new QueryClient()
    localStorage.setItem(StorageKey.TOKEN, 'fake.jwt.token')
    localStorage.setItem(StorageKey.USER, JSON.stringify(fakeAuthUser()))
    localStorage.setItem(StorageKey.PERSISTENT_COUNTER, '3')
    sessionStorage.setItem(StorageKey.SESSION_COUNTER, '2')
    await db.notes.add(fakeNote())
    queryClient.setQueryData(NOTES_QUERY_KEY, [fakeRemoteNote()])

    await clearLocalUserData(queryClient)

    expect(localStorage.getItem(StorageKey.TOKEN)).toBeNull()
    expect(localStorage.getItem(StorageKey.USER)).toBeNull()
    expect(localStorage.getItem(StorageKey.PERSISTENT_COUNTER)).toBeNull()
    expect(sessionStorage.getItem(StorageKey.SESSION_COUNTER)).toBeNull()
    expect(await db.notes.toArray()).toHaveLength(0)
    expect(queryClient.getQueryData(NOTES_QUERY_KEY)).toBeUndefined()
  })

  it('keeps the theme mode, which describes the device and not the account', async () => {
    localStorage.setItem(THEME_MODE_KEY, 'dark')

    await clearLocalUserData(new QueryClient())

    expect(localStorage.getItem(THEME_MODE_KEY)).toBe('dark')
  })
})
