import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/renderWithProviders'
import { Button } from './Button'

describe('Button', () => {
  it('renders its children when not loading', () => {
    renderWithProviders(<Button onClick={() => {}}>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })

  it('shows a loading label and disables the button while loading', () => {
    renderWithProviders(
      <Button loading onClick={() => {}}>
        Save
      </Button>,
    )

    expect(screen.queryByText('Save')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled()
  })

  it('is disabled when the disabled prop is set', () => {
    renderWithProviders(
      <Button disabled onClick={() => {}}>
        Save
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
