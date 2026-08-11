// Single import surface for tests: render + queries + user-event + fakes + the MSW server.
export { screen, waitFor, within } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { http, HttpResponse } from 'msw'

export { renderWithProviders, fakeAuthValue } from './renderWithProviders'
export { server } from './server'
export { handlers } from './handlers'
export { fakeAuthUser, fakeAuthResponse, fakeUser, fakeNote, fakeRemoteNote } from './fakes'
