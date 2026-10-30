import { createContext, type ActionDispatch, type RefObject } from 'react'
import type { ConsentAction, ConsentState } from '../analytics/consent'

export interface ConsentContextValue {
  /** Where the visitor stands on each purpose. */
  readonly state: ConsentState
  readonly dispatch: ActionDispatch<[action: ConsentAction]>
  /**
   * The control that opens the choice again — where the focus lands once an answer takes away the control it was
   * given with.
   */
  readonly reopener: RefObject<HTMLButtonElement | null>
}

export const ConsentContext = createContext<ConsentContextValue | null>(null)
