import { describe, expect, it } from 'vitest'
import { API_PREFIX } from '../api/apiVersion'
import { LocaleSwitcher } from '../components/layout/LocaleSwitcher'
import { renderWithProviders, screen, server, userEvent, waitFor } from '../../test/test-utils'

/** Every call the page made, so a test can read what reached the proxy. */
function recordCalls() {
  const calls: string[] = []
  server.events.on('request:start', ({ request }) => calls.push(`${request.method} ${new URL(request.url).pathname}`))
  return calls
}

describe('AuthProvider', () => {
  it('keeps a signed-out visitor’s language on this device and sends it nowhere', async () => {
    const calls = recordCalls()
    renderWithProviders(<LocaleSwitcher />, { useRealAuth: true })
    await waitFor(() => expect(calls).toContain(`GET ${API_PREFIX}/users/me`))

    await userEvent.click(screen.getByRole('button', { name: 'Change language' }))
    await userEvent.click(screen.getByRole('menuitem', { name: /Slovenčina/ }))

    expect(await screen.findByRole('button', { name: 'Zmeniť jazyk' })).toBeVisible()
    expect(calls).not.toContain(`PUT ${API_PREFIX}/users/me/locale`)
  })
})
