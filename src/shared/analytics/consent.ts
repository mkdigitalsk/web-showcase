/** What the showcase asks consent for — each purpose a consent of its own, in the order the dialog lists them. */
export const PURPOSES = ['measurement', 'errorRecording'] as const

export type Purpose = (typeof PURPOSES)[number]

/** The two answers a visitor can give to a purpose. */
export const CONSENTS = ['granted', 'denied'] as const

export type Consent = (typeof CONSENTS)[number]

/** Where the visitor stands on one purpose. */
export type PurposeConsent = { status: 'unanswered' } | { status: 'answered'; consent: Consent }

/** One answer a purpose — what a button of the bar or the dialog's save gives, every purpose at once. */
export type Answers = Readonly<Record<Purpose, Consent>>

/** Where the visitor stands on every purpose, and whether the dialog is open for them to choose. */
export interface ConsentState {
  readonly purposes: Readonly<Record<Purpose, PurposeConsent>>
  readonly choosing: boolean
}

/**
 * What moves where the visitor stands:
 * - `answer` — every purpose answered at once
 * - `choose` — the dialog opened, to choose a purpose at a time
 * - `dismiss` — the dialog closed unanswered
 */
export type ConsentAction = { type: 'answer'; answers: Answers } | { type: 'choose' } | { type: 'dismiss' }

/**
 * The first-party cookie keeping each purpose's answer until {@link CONSENT_MAX_AGE} ends it — one a purpose, so each
 * is given and taken back on its own.
 *
 * @see {@link https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_en.pdf#page=14 | EDPB — Guidelines 05/2020 on consent under Regulation 2016/679, paragraph 60}
 */
export const CONSENT_COOKIES = {
  measurement: 'analytics_consent',
  errorRecording: 'errors_consent',
} as const satisfies Record<Purpose, string>

/**
 * Twelve months, after which the bar asks again — whichever way the visitor answered.
 *
 * @see {@link https://www.teleoff.gov.sk/files/urad/odbory-oddelenia/odbor-statneho-dohladu-elektronickych-komunikacii/problematika-cookies/stanovisko-uradu-k-ziskavaniu-suhlasu/cookies-stanovisko_12-11-2025.pdf | Úrad pre reguláciu elektronických komunikácií a poštových služieb — Stanovisko k získavaniu súhlasu podľa ustanovenia § 109 ods. 8 zákona č. 452/2021 Z. z., časť F}
 */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365

/**
 * The day the bar's question was last worded — an answer kept under another day answered another question, so the
 * bar asks again. Move it whenever a purpose's question changes what it covers.
 */
const CONSENT_WORDING = '2026-10-30'

/** What a purpose's cookie keeps for an answer — the answer and the wording it answered. */
export const consentCookieValue = (consent: Consent): string => `${consent}.${CONSENT_WORDING}`

/** One value a purpose, each worked out from that purpose alone. */
const eachPurpose = <T>(of: (purpose: Purpose) => T): Readonly<Record<Purpose, T>> => ({
  measurement: of('measurement'),
  errorRecording: of('errorRecording'),
})

/** The same answer to every purpose — the bar's allow-all and reject-all. */
export const sameAnswer = (consent: Consent): Answers => eachPurpose(() => consent)

/** The state one purpose starts the visit in — `unanswered` when its cookie holds no answer to the bar's wording. */
function purposeConsentOf(cookie: string | undefined): PurposeConsent {
  const consent = CONSENTS.find((answer) => consentCookieValue(answer) === cookie)
  return consent === undefined ? { status: 'unanswered' } : { status: 'answered', consent }
}

/** The state the browser's cookies start the visit in, [cookie] reading one by its name. */
export const consentStateOf = (cookie: (name: string) => string | undefined): ConsentState => ({
  purposes: eachPurpose((purpose) => purposeConsentOf(cookie(CONSENT_COOKIES[purpose]))),
  choosing: false,
})

/** The state after what the visitor did. */
export function nextConsentState(state: ConsentState, action: ConsentAction): ConsentState {
  switch (action.type) {
    case 'answer':
      return {
        purposes: eachPurpose((purpose) => ({ status: 'answered', consent: action.answers[purpose] })),
        choosing: false,
      }
    case 'choose':
      return { ...state, choosing: true }
    case 'dismiss':
      return { ...state, choosing: false }
  }
}

/** Whether the bar asks — it does while any purpose is unanswered. */
export const isAsking = (state: ConsentState): boolean =>
  PURPOSES.some((purpose) => state.purposes[purpose].status === 'unanswered')

/** Whether the dialog is open for the visitor to choose a purpose at a time. */
export const isChoosing = (state: ConsentState): boolean => state.choosing

/** Whether a purpose's script may run — once allowed, until an answer says otherwise. */
function allows(state: ConsentState, purpose: Purpose): boolean {
  const stands = state.purposes[purpose]
  return stands.status === 'answered' && stands.consent === 'granted'
}

/** Whether [next] takes back a purpose [state] allows — its loaded script runs until the page unloads. */
export const withdraws = (state: ConsentState, next: ConsentState): boolean =>
  PURPOSES.some((purpose) => allows(state, purpose) && !allows(next, purpose))

/** Whether Vercel's measurement scripts may load. */
export const allowsMeasurement = (state: ConsentState): boolean => allows(state, 'measurement')

/** Whether the error tracker may start in the browser. */
export const allowsErrorRecording = (state: ConsentState): boolean => allows(state, 'errorRecording')

/**
 * The answers the dialog opens with — what each purpose stands at, one never allowed as denied, so nothing is
 * pre-ticked.
 */
export const answersOf = (state: ConsentState): Answers =>
  eachPurpose((purpose) => (allows(state, purpose) ? 'granted' : 'denied'))
