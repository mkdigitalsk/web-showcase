import { describe, it, expect } from 'vitest'
import { Locale } from '../enums/locale'
import { useLocale } from '../hooks'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import { LOCALE_STORAGE_KEY } from './LocaleProvider'

function SwitchToGerman() {
  const { setLocale } = useLocale()
  return <button onClick={() => setLocale(Locale.DE_DE)}>Deutsch</button>
}

describe('LocaleProvider', () => {
  it('names the language the page is read in on <html>', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(Locale.SK_SK))
    renderWithProviders(<SwitchToGerman />)

    expect(document.documentElement).toHaveAttribute('lang', Locale.SK_SK)
  })

  it('renames it on <html> as the language changes', async () => {
    renderWithProviders(<SwitchToGerman />)

    await userEvent.click(screen.getByRole('button', { name: 'Deutsch' }))

    expect(document.documentElement).toHaveAttribute('lang', Locale.DE_DE)
  })
})
