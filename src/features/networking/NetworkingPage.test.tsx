import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, server, http, HttpResponse } from '../../test/test-utils'
import { NetworkingPage } from './NetworkingPage'

describe('NetworkingPage', () => {
  it('renders the users fetched from the API', async () => {
    renderWithProviders(<NetworkingPage />)

    expect(await screen.findByText('alice@mkdigital.sk')).toBeVisible()
    expect(screen.getByText('bob@mkdigital.sk')).toBeVisible()
  })

  it('shows an error with a retry action when the fetch fails', async () => {
    server.use(http.get('*/v1/users', () => new HttpResponse(null, { status: 500 })))
    renderWithProviders(<NetworkingPage />)

    expect(await screen.findByText(/Something went wrong on our side/)).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
  })
})
