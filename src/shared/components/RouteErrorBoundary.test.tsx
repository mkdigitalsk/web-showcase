import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Route, Routes } from 'react-router-dom'
import { Routes as AppRoutes } from '../../utils'
import { fakeAuthValue, renderWithProviders, screen, userEvent } from '../../test/test-utils'
import { AppLayout } from './layout/AppLayout'
import { PublicLayout } from './layout/PublicLayout'
import { RouteErrorBoundary } from './RouteErrorBoundary'

// React logs every caught error to the console; the boundary is the assertion, not the noise.
beforeEach(() => {
  crashing.value = true
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => vi.restoreAllMocks())

function Crashing(): never {
  throw new Error('column "owner_id" does not exist')
}

// The test flips this between the crash and the retry. React may render a throwing tree twice, so the
// component must not be the thing that decides when to stop crashing.
const crashing = { value: true }
function CrashesWhileFlagged() {
  if (crashing.value) throw new Error('first render only')
  return <p>Recovered</p>
}

describe('RouteErrorBoundary', () => {
  it('replaces the crashed route with something the user can act on', () => {
    renderWithProviders(
      <RouteErrorBoundary>
        <Crashing />
      </RouteErrorBoundary>,
    )

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible()
  })

  it('never renders the thrown message', () => {
    renderWithProviders(
      <RouteErrorBoundary>
        <Crashing />
      </RouteErrorBoundary>,
    )

    expect(screen.queryByText(/owner_id/)).not.toBeInTheDocument()
  })

  it('renders the route again on retry', async () => {
    renderWithProviders(
      <RouteErrorBoundary>
        <CrashesWhileFlagged />
      </RouteErrorBoundary>,
    )

    crashing.value = false
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(screen.getByText('Recovered')).toBeVisible()
  })
})

// Reaches for the layouts production routes through, so removing the boundary from one fails here. The
// component tests above pass either way — they render the boundary the test itself wrote down.
describe.each([
  ['AppLayout', AppLayout],
  ['PublicLayout', PublicLayout],
])('%s', (_name, Layout) => {
  it('keeps its chrome when the route inside it crashes', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path={AppRoutes.ROOT} element={<Crashing />} />
        </Route>
      </Routes>,
      { authValue: fakeAuthValue() },
    )

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeVisible()
    expect(screen.getByText('Web Showcase')).toBeVisible()
  })
})
