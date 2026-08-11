import type { RemoteNote } from '../shared/types'
import type { AuthResponse, AuthUser, User } from '../shared/types'
import type { Note } from '../features/database/types'

export function fakeNote(overrides: Partial<Note> = {}): Note {
  return { title: 'Groceries', content: 'Milk and eggs', createdAt: 1_700_000_000_000, ...overrides }
}

export function fakeAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return { id: 1, email: 'test01@mkdigital.sk', themeMode: 'system', locale: 'en-GB', demo: false, ...overrides }
}

export function fakeAuthResponse(overrides: Partial<AuthResponse> = {}): AuthResponse {
  return { token: 'fake.jwt.token', user: fakeAuthUser(overrides.user), ...overrides }
}

export function fakeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'alice@mkdigital.sk',
    createdAt: 1_700_000_000_000,
    themeMode: 'system',
    locale: 'en-GB',
    demo: false,
    ...overrides,
  }
}

export function fakeRemoteNote(overrides: Partial<RemoteNote> = {}): RemoteNote {
  return { id: 1, title: 'Buy milk', content: 'two litres', createdAt: 0, updatedAt: 0, etag: '"0"', ...overrides }
}
