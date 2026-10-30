import * as Sentry from '@sentry/browser'
import { act } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import en from './locales/en.json'
import {
  CONSENT_COOKIES,
  consentCookieValue,
  PURPOSES,
  sameAnswer,
  type Consent,
  type Purpose,
} from './shared/analytics/consent'
import { keepAnswers } from './shared/services/consentCookies'
import { forgetTheClient, thrownOnThePage, trackerNamed } from './test/errorTracker'
import { eventsIn, trackerReceiving } from './test/trackerEnvelopes'
import { renderApp, screen, userEvent, waitFor, within } from './test/test-utils'
import { beforeSendIn, forgetVercelScripts } from './test/vercelQueues'
import { Routes } from './utils'

/** The cookie the browser keeps for [purpose], as `name=value`, or none. */
const cookieFor = (purpose: Purpose) =>
  document.cookie.split('; ').find((cookie) => cookie.startsWith(`${CONSENT_COOKIES[purpose]}=`))

/** The cookie that keeps [answer] to [purpose]. */
const kept = (purpose: Purpose, answer: Consent) => `${CONSENT_COOKIES[purpose]}=${consentCookieValue(answer)}`

/** Every script the page has asked the browser to fetch. */
const requestedScripts = () =>
  Array.from(document.head.querySelectorAll('script[src]'), (script) => script.getAttribute('src'))

/** The words a message wraps in its link — the privacy notice's name, as the bar and the dialog link it. */
const linkIn = (message: string) => /<link>(.+?)<\/link>/.exec(message)?.[1] ?? ''

const PRIVACY_LINK = linkIn(en['consent.text'])

const bar = () => screen.queryByRole('region', { name: en['consent.label'] })

const barButton = (name: string) =>
  within(screen.getByRole('region', { name: en['consent.label'] })).getByRole('button', { name })

/** The dialog where a purpose is chosen at a time, once open. */
const dialog = () => screen.findByRole('dialog', { name: en['consent.change'] })

const NAMES = { measurement: en['consent.measurement.name'], errorRecording: en['consent.errorRecording.name'] }

const box = async (purpose: Purpose) => within(await dialog()).getByRole('checkbox', { name: NAMES[purpose] })

const save = async () =>
  userEvent.click(within(await dialog()).getByRole('button', { name: en['consent.dialog.save'] }))

/** The footer's way back to the choice. */
const footerButton = () => within(screen.getByRole('contentinfo')).getByRole('button', { name: en['consent.change'] })

/** The showcase at its privacy notice, the browser keeping these answers, one a purpose, or none. */
async function openShowcase(answers: Partial<Record<Purpose, Consent>> = {}) {
  for (const purpose of PURPOSES) {
    const given = answers[purpose]
    if (given !== undefined) document.cookie = `${kept(purpose, given)}; path=/`
  }
  await renderApp(Routes.PRIVACY)
  await screen.findByRole('heading', { name: en['privacy.title'] })
}

/** Lets every start of the error tracker the page asked for finish — its module loaded here first, so a page that asked has it within the turn. */
async function startsSettled(): Promise<void> {
  await import('./shared/errorTracking/browserErrorTracking')
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
}

/** Whether the error tracker started in the browser, once the page had its turn. */
async function recordsErrors(): Promise<boolean> {
  await startsSettled()
  return Sentry.isInitialized()
}

/** Whether an error thrown on the page, which no code catches, reaches the tracker. */
async function sendsAThrownError(): Promise<boolean> {
  const envelopes = trackerReceiving()
  await startsSettled()
  thrownOnThePage(new TypeError('a page broke'))
  await Sentry.flush(1_000)
  return eventsIn(envelopes).length > 0
}

/** A deployment that names the error tracker, so starting it is the consent's to decide. */
beforeEach(() => {
  trackerNamed()
})

afterEach(async () => {
  await startsSettled()
  forgetVercelScripts()
  forgetTheClient()
})

describe('measuring visits and recording errors', () => {
  it('asks first — allow all and reject all side by side, choosing beside them — and sends nothing meanwhile', async () => {
    await openShowcase()

    const asking = screen.getByRole('region', { name: en['consent.label'] })
    const allowAll = within(asking).getByRole('button', { name: en['consent.allowAll'] })
    const rejectAll = within(asking).getByRole('button', { name: en['consent.rejectAll'] })
    expect(allowAll.className, 'the two answers carry one weight').toBe(rejectAll.className)
    expect(within(asking).getByRole('button', { name: en['consent.choose'] })).toBeInTheDocument()
    expect(asking, 'the bar names where the choice changes later').toHaveTextContent(en['consent.change'])
    expect(within(asking).getByRole('link', { name: PRIVACY_LINK })).toHaveAttribute('href', Routes.PRIVACY)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(requestedScripts()).toEqual([])
    expect(window.va).toBeUndefined()
    expect(window.si).toBeUndefined()
    expect(cookieFor('measurement')).toBeUndefined()
    expect(cookieFor('errorRecording')).toBeUndefined()
    expect(await recordsErrors()).toBe(false)
    expect(await sendsAThrownError()).toBe(false)
  })

  it('measures and records errors once all is allowed, and keeps both answers', async () => {
    await openShowcase()

    await userEvent.click(barButton(en['consent.allowAll']))

    expect(window.va).toBeDefined()
    expect(window.si).toBeDefined()
    expect(requestedScripts()).toHaveLength(2)
    expect(cookieFor('measurement')).toBe(kept('measurement', 'granted'))
    expect(cookieFor('errorRecording')).toBe(kept('errorRecording', 'granted'))
    expect(bar()).not.toBeInTheDocument()
    await vi.waitFor(() => expect(Sentry.isInitialized()).toBe(true))
    expect(await sendsAThrownError()).toBe(true)
  })

  it('keeps a rejection of all, and sends nothing', async () => {
    await openShowcase()

    await userEvent.click(barButton(en['consent.rejectAll']))

    expect(cookieFor('measurement')).toBe(kept('measurement', 'denied'))
    expect(cookieFor('errorRecording')).toBe(kept('errorRecording', 'denied'))
    expect(bar()).not.toBeInTheDocument()
    expect(requestedScripts()).toEqual([])
    expect(window.va).toBeUndefined()
    expect(window.si).toBeUndefined()
    expect(await recordsErrors()).toBe(false)
    expect(await sendsAThrownError()).toBe(false)
  })

  it('lets the visitor choose a purpose at a time — nothing ticked first — and loads only what they ticked', async () => {
    await openShowcase()

    await userEvent.click(barButton(en['consent.choose']))

    const choosing = await dialog()
    expect(choosing, 'the dialog says what unticked means').toHaveTextContent(
      en['consent.dialog.lead'].replace(/<\/?link>/g, ''),
    )
    for (const purpose of PURPOSES) expect(await box(purpose), `${purpose} starts unticked`).not.toBeChecked()
    expect(await box('measurement')).toHaveAccessibleDescription(en['consent.measurement.what'])
    expect(await box('errorRecording')).toHaveAccessibleDescription(en['consent.errorRecording.what'])
    expect(requestedScripts()).toEqual([])

    await userEvent.click(await box('measurement'))
    await save()

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(bar()).not.toBeInTheDocument()
    expect(cookieFor('measurement')).toBe(kept('measurement', 'granted'))
    expect(cookieFor('errorRecording')).toBe(kept('errorRecording', 'denied'))
    expect(window.va).toBeDefined()
    expect(window.si).toBeDefined()
    expect(await recordsErrors()).toBe(false)
  })

  it('keeps asking when the dialog closes unsaved, and keeps no answer', async () => {
    await openShowcase()

    await userEvent.click(barButton(en['consent.choose']))
    await userEvent.click(await box('errorRecording'))
    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(bar()).toBeInTheDocument()
    expect(cookieFor('measurement')).toBeUndefined()
    expect(cookieFor('errorRecording')).toBeUndefined()
    expect(await recordsErrors()).toBe(false)

    await userEvent.click(barButton(en['consent.choose']))
    expect(await box('errorRecording'), 'a closed draft is gone').not.toBeChecked()
  })

  it('asks no one who has answered both, and loads what each answer allowed', async () => {
    await openShowcase({ measurement: 'granted', errorRecording: 'denied' })

    expect(bar()).not.toBeInTheDocument()
    expect(window.va).toBeDefined()
    expect(window.si).toBeDefined()
    expect(await recordsErrors()).toBe(false)
  })

  it('asks again whoever answered one purpose but not the other, or answered another wording of the question', async () => {
    await openShowcase({ measurement: 'denied' })
    expect(bar()).toBeInTheDocument()

    document.cookie = `${CONSENT_COOKIES.measurement}=granted.2026-01-01; path=/`
    document.cookie = `${CONSENT_COOKIES.errorRecording}=granted.2026-01-01; path=/`
    await renderApp(Routes.PRIVACY)
    expect(await screen.findAllByRole('region', { name: en['consent.label'] })).toHaveLength(2)
    expect(requestedScripts()).toEqual([])
    expect(await recordsErrors()).toBe(false)
  })

  it('opens the dialog from the footer on what each purpose stands at, and saves a change of mind', async () => {
    await openShowcase({ measurement: 'denied', errorRecording: 'denied' })
    expect(bar()).not.toBeInTheDocument()

    await userEvent.click(footerButton())

    expect(await box('measurement')).not.toBeChecked()
    expect(await box('errorRecording')).not.toBeChecked()

    await userEvent.click(await box('errorRecording'))
    await save()

    expect(cookieFor('measurement')).toBe(kept('measurement', 'denied'))
    expect(cookieFor('errorRecording')).toBe(kept('errorRecording', 'granted'))
    expect(requestedScripts()).toEqual([])
    await vi.waitFor(() => expect(Sentry.isInitialized()).toBe(true))
  })

  it('closes the dialog when the visitor follows its link to the privacy notice', async () => {
    await renderApp(Routes.TERMS)
    await userEvent.click(barButton(en['consent.choose']))

    await userEvent.click(within(await dialog()).getByRole('link', { name: PRIVACY_LINK }))

    expect(await screen.findByRole('heading', { name: en['privacy.title'] })).toBeVisible()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(bar()).toBeInTheDocument()
  })
})

describe('a refusal kept after the scripts loaded', () => {
  it('hands Vercel nothing more once the browser keeps a refusal, as another tab keeps it', async () => {
    await openShowcase({ measurement: 'granted', errorRecording: 'denied' })
    const visits = beforeSendIn(window.vaq)
    const vitals = beforeSendIn(window.siq)
    const page = { type: 'pageview', url: `${window.location.origin}${Routes.PRIVACY}` }
    expect(visits?.(page)).toEqual(page)

    keepAnswers(sameAnswer('denied'))

    expect(visits?.(page)).toBeNull()
    expect(vitals?.({ ...page, type: 'vital' })).toBeNull()
  })

  it('sends the tracker nothing more once the browser keeps a refusal, as another tab keeps it', async () => {
    await openShowcase({ measurement: 'denied', errorRecording: 'granted' })
    await vi.waitFor(() => expect(Sentry.isInitialized()).toBe(true))

    keepAnswers(sameAnswer('denied'))

    expect(await sendsAThrownError()).toBe(false)
  })
})

/** A keyboard visitor whose answer takes away the control they gave it with. */
describe('the focus once the visitor answers', () => {
  it.each([en['consent.allowAll'], en['consent.rejectAll']])(
    'lands on the footer’s way back to the choice once the bar’s “%s” is answered',
    async (answer) => {
      await openShowcase()

      await userEvent.click(barButton(answer))

      expect(bar()).not.toBeInTheDocument()
      expect(footerButton()).toHaveFocus()
    },
  )

  it('lands there too once the choice the bar opened is saved', async () => {
    await openShowcase()
    await userEvent.click(barButton(en['consent.choose']))

    await save()

    expect(bar()).not.toBeInTheDocument()
    await waitFor(() => expect(footerButton()).toHaveFocus())
  })

  it('goes back to the bar while it still asks, the dialog closed unsaved', async () => {
    await openShowcase()
    await userEvent.click(barButton(en['consent.choose']))
    await dialog()

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(barButton(en['consent.choose'])).toHaveFocus())
  })
})
