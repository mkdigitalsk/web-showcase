import { describe, it, expect } from 'vitest'
import { API_PREFIX } from '../../shared/api/apiVersion'
import {
  fakeAuthUser,
  http,
  HttpResponse,
  renderApp,
  screen,
  server,
  userEvent,
  waitFor,
  within,
} from '../../test/test-utils'
import { Routes } from '../../utils'

async function openUiComponents() {
  server.use(http.get(`*${API_PREFIX}/users/me`, () => HttpResponse.json(fakeAuthUser())))
  await renderApp(Routes.UI_COMPONENTS)
  await screen.findByRole('heading', { level: 1, name: 'UI Components' })
}

/** Rendered through the app's own root, so the notice proves the region the root mounts, not one the test adds. */
describe('UiComponentsPage', () => {
  /** The engine hides a notice's Close from a screen reader until the pointer or the focus reaches the notices. */
  it('raises a notice in the notifications region, and its Close takes it away', async () => {
    await openUiComponents()

    await userEvent.click(screen.getByRole('button', { name: 'Show Snackbar' }))

    const region = screen.getByRole('region', { name: 'Notifications' })
    const notice = await within(region).findByText('Saved successfully!')
    expect(notice).toBeVisible()
    await userEvent.hover(notice)
    await userEvent.click(within(region).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(within(region).queryByText('Saved successfully!')).not.toBeInTheDocument())
  })

  it('takes the deletable chip away on its Remove, and focus moves to the next chip', async () => {
    await openUiComponents()

    await userEvent.click(screen.getByRole('button', { name: 'Remove Deletable' }))

    expect(screen.queryByText('Deletable')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveFocus()
  })
})
