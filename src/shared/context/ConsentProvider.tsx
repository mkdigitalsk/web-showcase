import { useReducer, useRef, type ReactNode } from 'react'
import { nextConsentState } from '../analytics/consent'
import { storedConsent } from '../services/consentCookies'
import { ConsentContext } from './ConsentContext'

/** Starts from what the browser's cookies keep, so the first screen asks only whom it should. */
export function ConsentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(nextConsentState, undefined, storedConsent)
  const reopener = useRef<HTMLButtonElement>(null)

  return <ConsentContext.Provider value={{ state, dispatch, reopener }}>{children}</ConsentContext.Provider>
}
