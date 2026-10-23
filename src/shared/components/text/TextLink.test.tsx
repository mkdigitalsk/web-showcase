import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../../test/test-utils'
import { Routes } from '../../../utils'
import { TextLink } from './TextLink'

/** A route of this app stays in the tab; an address elsewhere opens in a new one, and never hands it the opener. */
describe('TextLink', () => {
  it('opens an address elsewhere in a new tab, without the opener', () => {
    renderWithProviders(<TextLink href="https://example.com/spec">The specification</TextLink>)

    const link = screen.getByRole('link', { name: 'The specification' })
    expect(link).toHaveAttribute('href', 'https://example.com/spec')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener')
  })

  it('keeps a route of this app in the tab', () => {
    renderWithProviders(<TextLink to={Routes.NETWORKING}>The notes</TextLink>)

    const link = screen.getByRole('link', { name: 'The notes' })
    expect(link).toHaveAttribute('href', Routes.NETWORKING)
    expect(link).not.toHaveAttribute('target')
  })
})
