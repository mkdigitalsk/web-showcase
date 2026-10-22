import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import { Tooltip } from './Tooltip'

/** The tip is a hint for the sighted: hovering shows it, leaving ends it, and the control keeps its own name. */
describe('Tooltip', () => {
  it('shows the hint while the pointer rests on the control and hides it once the pointer leaves', async () => {
    renderWithProviders(
      <Tooltip title="Save the price">
        <button type="button" aria-label="Save">
          ✓
        </button>
      </Tooltip>,
    )

    await userEvent.hover(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Save the price')).toBeInTheDocument()

    await userEvent.unhover(screen.getByRole('button', { name: 'Save' }))
    expect(screen.queryByText('Save the price')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
