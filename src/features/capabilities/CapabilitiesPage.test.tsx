import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import { CapabilitiesPage } from './CapabilitiesPage'

function stubNavigator(prop: string, value: unknown) {
  Object.defineProperty(navigator, prop, { value, configurable: true, writable: true })
}

afterEach(() => {
  vi.unstubAllGlobals()
  for (const prop of ['clipboard', 'geolocation']) {
    Reflect.deleteProperty(navigator, prop)
  }
})

describe('CapabilitiesPage', () => {
  it('copies the text to the clipboard and confirms success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubNavigator('clipboard', { writeText, readText: vi.fn() })
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Copy to clipboard/ }))

    expect(await screen.findByText('Copied!')).toBeVisible()
    expect(writeText).toHaveBeenCalledWith('Hello from Web Showcase!')
  })

  it('reports the resolved coordinates from geolocation', async () => {
    stubNavigator('geolocation', {
      getCurrentPosition: (success: PositionCallback) =>
        success({ coords: { latitude: 48.14816, longitude: 17.10674 } } as GeolocationPosition),
    })
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Get location/ }))

    expect(await screen.findByText(/Lat: 48\.14816, Lng: 17\.10674/)).toBeVisible()
  })

  it('shows a denied message when geolocation is refused', async () => {
    stubNavigator('geolocation', {
      getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) =>
        error({} as GeolocationPositionError),
    })
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Get location/ }))

    expect(await screen.findByText('Permission denied')).toBeVisible()
  })

  it('sends a notification when permission is granted', async () => {
    const notificationCtor = vi.fn()
    class MockNotification {
      static permission: NotificationPermission = 'granted'
      static requestPermission = vi.fn().mockResolvedValue('granted' as NotificationPermission)
      constructor(title: string, options?: NotificationOptions) {
        notificationCtor(title, options)
      }
    }
    vi.stubGlobal('Notification', MockNotification)
    renderWithProviders(<CapabilitiesPage />)

    expect(screen.getByText('Granted')).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: /Send notification/ }))

    expect(await screen.findByText(/Notification sent/)).toBeVisible()
    expect(notificationCtor).toHaveBeenCalledWith('Web Showcase', { body: 'Hello from the web app!' })
  })

  it('flags capabilities the browser lacks as unsupported', () => {
    renderWithProviders(<CapabilitiesPage />)

    // jsdom exposes none of speechSynthesis / share / vibrate → the info fallbacks render.
    expect(screen.getByText('Speech Synthesis not supported')).toBeVisible()
    expect(screen.getByText('Web Share API not supported on this browser')).toBeVisible()
    expect(screen.getByText('Vibration API not supported on this device')).toBeVisible()
  })
})
