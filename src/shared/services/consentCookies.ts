import {
  CONSENT_COOKIES,
  CONSENT_MAX_AGE,
  consentCookieValue,
  consentStateOf,
  PURPOSES,
  type Answers,
  type ConsentState,
} from '../analytics/consent'

/** A cookie as the browser stores it now, read by its name — none where the browser holds no such cookie. */
const storedCookie = (name: string): string | undefined =>
  document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1)

/** Where the visitor stands as the browser's cookies hold it now — an answer another tab kept included. */
export const storedConsent = (): ConsentState => consentStateOf(storedCookie)

/** Keeps each purpose's answer in its cookie, where the next visit and every tab of this one read it. */
export function keepAnswers(answers: Answers): void {
  for (const purpose of PURPOSES) {
    document.cookie = `${CONSENT_COOKIES[purpose]}=${consentCookieValue(answers[purpose])}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax`
  }
}
