import { describe, it, expect } from 'vitest'
import { API_PREFIX } from '../../shared/api/apiVersion'
import {
  renderWithProviders,
  screen,
  server,
  http,
  HttpResponse,
  userEvent,
  fakeRemoteNote,
} from '../../test/test-utils'
import { NetworkingPage } from './NetworkingPage'

const notes = `*${API_PREFIX}/notes`

describe('NetworkingPage', () => {
  it('renders the notes the account owns', async () => {
    renderWithProviders(<NetworkingPage />)

    expect(await screen.findByText('Buy milk')).toBeVisible()
    expect(screen.getByText('two litres')).toBeVisible()
  })

  it('shows an error when the fetch fails', async () => {
    server.use(http.get(notes, () => new HttpResponse(null, { status: 500 })))
    renderWithProviders(<NetworkingPage />)

    expect(await screen.findByText(/Something went wrong on our side/)).toBeVisible()
  })

  it('sends the tag it read when saving an edit', async () => {
    let sent: string | null = null
    server.use(
      http.put(`${notes}/1`, ({ request }) => {
        sent = request.headers.get('If-Match')
        return HttpResponse.json(fakeRemoteNote({ title: 'Buy oat milk', etag: '"1"' }))
      }),
    )
    renderWithProviders(<NetworkingPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Edit note' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(sent).toBe('"0"')
  })

  // The write the server refuses. Both versions have to reach the screen, because choosing between
  // them is the person's — a client that auto-merged would pick a winner without saying so.
  it('offers both versions when the row moved under the edit', async () => {
    server.use(
      http.put(`${notes}/1`, () =>
        HttpResponse.json(fakeRemoteNote({ title: 'Someone else won', etag: '"7"' }), { status: 412 }),
      ),
    )
    renderWithProviders(<NetworkingPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Edit note' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('This note changed elsewhere')).toBeVisible()
    expect(screen.getByText('Someone else won')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Keep mine' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Discard mine' })).toBeVisible()
  })

  it('retries against the server tag when the person keeps their version', async () => {
    const sent: (string | null)[] = []
    server.use(
      http.put(`${notes}/1`, ({ request }) => {
        sent.push(request.headers.get('If-Match'))
        return sent.length === 1
          ? HttpResponse.json(fakeRemoteNote({ title: 'Someone else won', etag: '"7"' }), { status: 412 })
          : HttpResponse.json(fakeRemoteNote({ etag: '"8"' }))
      }),
    )
    renderWithProviders(<NetworkingPage />)

    await userEvent.click(await screen.findByRole('button', { name: 'Edit note' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Keep mine' }))

    expect(sent).toEqual(['"0"', '"7"'])
  })
})
