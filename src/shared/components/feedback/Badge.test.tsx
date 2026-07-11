import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../test/renderWithProviders'
import { BadgedBox } from './Badge'

describe('BadgedBox', () => {
  it('shows the count over its child', () => {
    renderWithProviders(
      <BadgedBox count={3}>
        <span>Inbox</span>
      </BadgedBox>,
    )

    expect(screen.getByText('3')).toBeVisible()
  })

  it('caps the displayed count at the max with a "+" suffix', () => {
    renderWithProviders(
      <BadgedBox count={150} maxCount={99}>
        <span>Inbox</span>
      </BadgedBox>,
    )

    expect(screen.getByText('99+')).toBeVisible()
    expect(screen.queryByText('150')).not.toBeInTheDocument()
  })

  it('hides the badge when the count is zero', () => {
    renderWithProviders(
      <BadgedBox count={0}>
        <span>Inbox</span>
      </BadgedBox>,
    )

    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })
})
