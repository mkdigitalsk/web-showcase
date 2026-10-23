import { act } from 'react'
import { describe, it, expect, vi, afterEach, onTestFinished } from 'vitest'
import { LOCALE_STORAGE_KEY } from '../../shared/context'
import { Locale } from '../../shared/enums/locale'
import { renderWithProviders, screen, userEvent } from '../../test/test-utils'
import CapabilitiesPage from './CapabilitiesPage'

function stubNavigator(prop: string, value: unknown) {
  Object.defineProperty(navigator, prop, { value, configurable: true, writable: true })
}

/** The error the browser hands a refused position request, its codes as the spec numbers them. */
function positionError(code: number) {
  return { code, message: '', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  for (const prop of ['clipboard', 'geolocation', 'share']) {
    Reflect.deleteProperty(navigator, prop)
  }
  Reflect.deleteProperty(document, 'fullscreenElement')
  Reflect.deleteProperty(document, 'fullscreenEnabled')
  Reflect.deleteProperty(document.documentElement, 'requestFullscreen')
})

/**
 * A voice that reads until told otherwise — `utterances` holds what it was handed, to end or fail one by hand. It goes
 * once the test has finished, after the page's unmount has silenced it.
 */
function stubSpeech() {
  const utterances: SpeechSynthesisUtterance[] = []
  const speechSynthesis = {
    speak: vi.fn((utterance: SpeechSynthesisUtterance) => utterances.push(utterance)),
    cancel: vi.fn(),
  }
  Object.defineProperty(window, 'speechSynthesis', { value: speechSynthesis, configurable: true })
  onTestFinished(() => {
    Reflect.deleteProperty(window, 'speechSynthesis')
  })
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    class {
      onend = null
      onerror = null
    },
  )
  return { speechSynthesis, utterances }
}

/** Puts `element` in fullscreen, or leaves it with `null`, and tells the document as the browser does. */
function changeFullscreen(element: Element | null) {
  Object.defineProperty(document, 'fullscreenElement', { value: element, configurable: true })
  act(() => {
    document.dispatchEvent(new Event('fullscreenchange'))
  })
}

describe('CapabilitiesPage', () => {
  it('names itself with a heading', () => {
    renderWithProviders(<CapabilitiesPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Capabilities' })).toBeInTheDocument()
  })

  it("words the browser's state in the page's language", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(Locale.SK_SK))
    renderWithProviders(<CapabilitiesPage />)

    expect(screen.getByText('Áno')).toBeVisible()
    expect(screen.getByText('Povolené')).toBeVisible()
  })

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
      getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => error(positionError(1)),
    })
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Get location/ }))

    expect(await screen.findByText('Permission denied')).toBeVisible()
  })

  it('sends a notification when permission is granted', async () => {
    const notificationCtor = vi.fn()
    class MockNotification {
      static permission: NotificationPermission = 'granted'
      static requestPermission = vi.fn().mockResolvedValue('granted')
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

  it('flags speech, share, vibrate and fullscreen, which jsdom lacks, as unsupported', () => {
    renderWithProviders(<CapabilitiesPage />)

    expect(screen.getByText('Speech Synthesis not supported')).toBeVisible()
    expect(screen.getByText('Web Share API not supported on this browser')).toBeVisible()
    expect(screen.getByText('Vibration API not supported on this device')).toBeVisible()
    expect(screen.getByText('Fullscreen not supported on this browser')).toBeVisible()
  })

  it('labels the fullscreen button by the state the browser reports, Esc included', () => {
    Object.defineProperty(document, 'fullscreenEnabled', { value: true, configurable: true })
    renderWithProviders(<CapabilitiesPage />)
    expect(screen.getByRole('button', { name: /Enter fullscreen/ })).toBeVisible()

    changeFullscreen(document.documentElement)
    expect(screen.getByRole('button', { name: /Exit fullscreen/ })).toBeVisible()

    changeFullscreen(null)
    expect(screen.getByRole('button', { name: /Enter fullscreen/ })).toBeVisible()
  })
})

describe('CapabilitiesPage, where the browser falls short', () => {
  it('says the location could not be found when a fix never comes', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    stubNavigator('geolocation', {
      getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback, options?: PositionOptions) => {
        if (options?.timeout === undefined) return
        setTimeout(() => error(positionError(3)), options.timeout)
      },
    })
    renderWithProviders(<CapabilitiesPage />)
    await userEvent.click(screen.getByRole('button', { name: /Get location/ }))

    await vi.runOnlyPendingTimersAsync()

    expect(await screen.findByText('Could not find your location')).toBeVisible()
  })

  it('says the location could not be found when the device has no fix', async () => {
    stubNavigator('geolocation', {
      getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => error(positionError(2)),
    })
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Get location/ }))

    expect(await screen.findByText('Could not find your location')).toBeVisible()
  })

  it('keeps a stopped voice from settling the one started after it', async () => {
    const { utterances } = stubSpeech()
    renderWithProviders(<CapabilitiesPage />)
    await userEvent.click(screen.getByRole('button', { name: /Speak/ }))
    await userEvent.click(screen.getByRole('button', { name: /Stop/ }))
    await userEvent.click(screen.getByRole('button', { name: /Speak/ }))
    expect(utterances).toHaveLength(2)

    act(() => {
      utterances[0]?.onerror?.call(utterances[0], new Event('error') as SpeechSynthesisErrorEvent)
    })

    expect(screen.getByRole('button', { name: /Stop/ })).toBeVisible()
  })

  it('offers the share sheet once while it is open', async () => {
    const share = vi.fn(() => new Promise<void>(() => undefined))
    stubNavigator('share', share)
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.dblClick(screen.getByRole('button', { name: /Share/ }))

    expect(share).toHaveBeenCalledOnce()
  })

  it('says when the browser refuses fullscreen', async () => {
    Object.defineProperty(document, 'fullscreenEnabled', { value: true, configurable: true })
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: vi.fn().mockRejectedValue(new TypeError('Permissions check failed')),
      configurable: true,
    })
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Enter fullscreen/ }))

    expect(await screen.findByText('The browser refused fullscreen')).toBeVisible()
  })

  it('lets the voice be started again once it fails', async () => {
    const { utterances } = stubSpeech()
    renderWithProviders(<CapabilitiesPage />)
    await userEvent.click(screen.getByRole('button', { name: /Speak/ }))
    expect(screen.getByRole('button', { name: /Stop/ })).toBeVisible()

    act(() => {
      utterances[0]?.onerror?.call(utterances[0], new Event('error') as SpeechSynthesisErrorEvent)
    })

    expect(screen.getByRole('button', { name: /Speak/ })).toBeVisible()
  })

  it('stops the voice when the page goes', async () => {
    const { speechSynthesis } = stubSpeech()
    const { unmount } = renderWithProviders(<CapabilitiesPage />)
    await userEvent.click(screen.getByRole('button', { name: /Speak/ }))
    expect(speechSynthesis.speak).toHaveBeenCalledOnce()

    unmount()

    expect(speechSynthesis.cancel).toHaveBeenCalled()
  })

  it('says when the share sheet refuses the page', async () => {
    stubNavigator('share', vi.fn().mockRejectedValue(new DOMException('No user activation', 'NotAllowedError')))
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Share/ }))

    expect(await screen.findByText('Could not share this page')).toBeVisible()
  })

  it('says nothing when the person dismisses the share sheet', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('Share canceled', 'AbortError'))
    stubNavigator('share', share)
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Share/ }))

    expect(share).toHaveBeenCalledOnce()
    expect(screen.queryByText('Could not share this page')).not.toBeInTheDocument()
  })

  it('says when the browser refuses the clipboard, which it still has', async () => {
    const readText = vi.fn().mockRejectedValue(new DOMException('Read permission denied.', 'NotAllowedError'))
    stubNavigator('clipboard', { writeText: vi.fn(), readText })
    renderWithProviders(<CapabilitiesPage />)

    await userEvent.click(screen.getByRole('button', { name: /Paste from clipboard/ }))

    expect(await screen.findByText('The browser refused the clipboard')).toBeVisible()
    expect(screen.queryByText('Clipboard API not supported')).not.toBeInTheDocument()
  })
})
