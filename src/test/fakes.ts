import type { AuthResponse, AuthUser, User } from '../shared/types'

export function fakeAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return { id: 1, email: 'test01@mkdigital.sk', name: 'Test One', themeMode: 'system', locale: 'en-GB', ...overrides }
}

export function fakeAuthResponse(overrides: Partial<AuthResponse> = {}): AuthResponse {
  return { token: 'fake.jwt.token', user: fakeAuthUser(overrides.user), ...overrides }
}

export function fakeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    email: 'alice@mkdigital.sk',
    name: 'Alice',
    createdAt: 1_700_000_000_000,
    themeMode: 'system',
    locale: 'en-GB',
    ...overrides,
  }
}
