import { describe, expect, it } from 'vitest'
import {
  allowsErrorRecording,
  allowsMeasurement,
  answersOf,
  CONSENT_COOKIES,
  consentCookieValue,
  consentStateOf,
  isAsking,
  isChoosing,
  nextConsentState,
  PURPOSES,
  sameAnswer,
  withdraws,
  type ConsentState,
  type PurposeConsent,
} from './consent'

const UNANSWERED: PurposeConsent = { status: 'unanswered' }
const ALLOWED: PurposeConsent = { status: 'answered', consent: 'granted' }
const REJECTED: PurposeConsent = { status: 'answered', consent: 'denied' }

/** A visit standing at these two purposes, the dialog closed. */
const standing = (measurement: PurposeConsent, errorRecording: PurposeConsent): ConsentState => ({
  purposes: { measurement, errorRecording },
  choosing: false,
})

/** The browser's cookies, read by name. */
const cookies = (values: Readonly<Record<string, string>>) => (name: string) => values[name]

describe('the state a visit starts in', () => {
  it('is unanswered on both purposes for a browser keeping no answer, the dialog closed', () => {
    expect(consentStateOf(cookies({}))).toEqual(standing(UNANSWERED, UNANSWERED))
  })

  it('is the answer each purpose’s cookie keeps, one apart from the other', () => {
    expect(
      consentStateOf(
        cookies({
          [CONSENT_COOKIES.measurement]: consentCookieValue('granted'),
          [CONSENT_COOKIES.errorRecording]: consentCookieValue('denied'),
        }),
      ),
    ).toEqual(standing(ALLOWED, REJECTED))
    expect(consentStateOf(cookies({ [CONSENT_COOKIES.errorRecording]: consentCookieValue('granted') }))).toEqual(
      standing(UNANSWERED, ALLOWED),
    )
  })

  it('is unanswered for an answer kept under another wording of the question', () => {
    expect(consentStateOf(cookies({ [CONSENT_COOKIES.measurement]: 'granted.2026-01-01' }))).toEqual(
      standing(UNANSWERED, UNANSWERED),
    )
  })

  it('is unanswered for a cookie holding neither answer', () => {
    expect(
      consentStateOf(cookies({ [CONSENT_COOKIES.measurement]: 'yes', [CONSENT_COOKIES.errorRecording]: '' })),
    ).toEqual(standing(UNANSWERED, UNANSWERED))
  })

  it('keeps each purpose’s answer in a cookie of its own', () => {
    expect(new Set(Object.values(CONSENT_COOKIES)).size).toBe(PURPOSES.length)
  })
})

describe('the visitor answering', () => {
  it.each([
    standing(UNANSWERED, UNANSWERED),
    standing(ALLOWED, REJECTED),
    { ...standing(REJECTED, ALLOWED), choosing: true },
  ])('settles every purpose on its answer and closes the dialog, from %o', (state) => {
    expect(
      nextConsentState(state, { type: 'answer', answers: { measurement: 'granted', errorRecording: 'denied' } }),
    ).toEqual(standing(ALLOWED, REJECTED))
  })

  it('answers every purpose the same from the bar’s two buttons', () => {
    expect(sameAnswer('granted')).toEqual({ measurement: 'granted', errorRecording: 'granted' })
    expect(sameAnswer('denied')).toEqual({ measurement: 'denied', errorRecording: 'denied' })
  })

  it.each([
    [standing(ALLOWED, UNANSWERED), sameAnswer('denied'), true],
    [standing(ALLOWED, REJECTED), { measurement: 'granted', errorRecording: 'denied' } as const, false],
    [standing(REJECTED, ALLOWED), { measurement: 'granted', errorRecording: 'denied' } as const, true],
    [standing(UNANSWERED, UNANSWERED), sameAnswer('denied'), false],
    [standing(REJECTED, REJECTED), sameAnswer('granted'), false],
  ])('takes back what %o allowed, answered %o: %s', (state, answers, takesBack) => {
    expect(withdraws(state, nextConsentState(state, { type: 'answer', answers }))).toBe(takesBack)
  })
})

describe('the visitor choosing in the dialog', () => {
  it('opens it from the bar or the footer, the answers standing as they were', () => {
    const open = nextConsentState(standing(ALLOWED, UNANSWERED), { type: 'choose' })

    expect(open).toEqual({ ...standing(ALLOWED, UNANSWERED), choosing: true })
    expect(isChoosing(open)).toBe(true)
  })

  it('closes it unanswered, the answers standing as they were', () => {
    const open = nextConsentState(standing(REJECTED, ALLOWED), { type: 'choose' })

    expect(nextConsentState(open, { type: 'dismiss' })).toEqual(standing(REJECTED, ALLOWED))
  })

  it.each([
    [standing(UNANSWERED, UNANSWERED), { measurement: 'denied', errorRecording: 'denied' }],
    [standing(ALLOWED, UNANSWERED), { measurement: 'granted', errorRecording: 'denied' }],
    [standing(REJECTED, ALLOWED), { measurement: 'denied', errorRecording: 'granted' }],
  ])('opens on what each purpose stands at, never pre-ticked — %o', (state, answers) => {
    expect(answersOf(state)).toEqual(answers)
  })
})

describe('what each state shows', () => {
  it.each([
    [standing(UNANSWERED, UNANSWERED), true],
    [standing(ALLOWED, UNANSWERED), true],
    [standing(UNANSWERED, REJECTED), true],
    [standing(ALLOWED, REJECTED), false],
    [standing(REJECTED, REJECTED), false],
  ])('%o asks in the bar: %s', (state, asks) => {
    expect(isAsking(state)).toBe(asks)
  })

  it.each([
    [UNANSWERED, false],
    [ALLOWED, true],
    [REJECTED, false],
  ])('%o allows its own purpose and speaks for no other: %s', (state, allows) => {
    expect(allowsMeasurement(standing(state, REJECTED))).toBe(allows)
    expect(allowsErrorRecording(standing(REJECTED, state))).toBe(allows)
    expect(allowsErrorRecording(standing(state, REJECTED))).toBe(false)
    expect(allowsMeasurement(standing(REJECTED, state))).toBe(false)
  })
})
