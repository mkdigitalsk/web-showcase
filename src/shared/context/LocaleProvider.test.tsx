import { describe, it, expect } from 'vitest'
import { Locale } from '../enums/locale'
import { useLocale } from '../hooks'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import { LOCALE_STORAGE_KEY } from './LocaleProvider'

function SwitchToSlovak() {
  const { setLocale } = useLocale()
  return <button onClick={() => setLocale(Locale.SK_SK)}>Slovenčina</button>
}

describe('LocaleProvider', () => {
  it('names the language the page is read in on <html>', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(Locale.SK_SK))
    renderWithProviders(<SwitchToSlovak />)

    expect(document.documentElement).toHaveAttribute('lang', Locale.SK_SK)
  })

  it('renames it on <html> as the language changes', async () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(Locale.EN_GB))
    renderWithProviders(<SwitchToSlovak />)
    expect(document.documentElement).toHaveAttribute('lang', Locale.EN_GB)

    await userEvent.click(screen.getByRole('button', { name: 'Slovenčina' }))

    expect(document.documentElement).toHaveAttribute('lang', Locale.SK_SK)
  })

  it('reads a kept language the app no longer offers in English', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify('de-DE'))
    renderWithProviders(<SwitchToSlovak />)

    expect(document.documentElement).toHaveAttribute('lang', Locale.EN_GB)
  })
})
