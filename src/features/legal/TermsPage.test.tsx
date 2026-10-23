import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../test/test-utils'
import TermsPage from './TermsPage'

describe('TermsPage', () => {
  it('prints the terms section by section and says the Slovak text governs', () => {
    renderWithProviders(<TermsPage />)

    expect(screen.getByRole('heading', { name: 'Terms of use of the showcase apps' })).toBeVisible()
    expect(screen.getByRole('heading', { name: '1. Who provides the apps' })).toBeVisible()
    expect(screen.getByRole('heading', { name: '9. Consumers, governing law and disputes' })).toBeVisible()
    expect(screen.getByText(/You conclude the contract to use the apps by creating an account/)).toBeVisible()
    expect(screen.getByText(/The Slovak version is the original and governs/)).toBeVisible()
  })
})
