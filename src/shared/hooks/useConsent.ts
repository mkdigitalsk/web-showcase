import { useContext } from 'react'
import { nextConsentState, withdraws, type Answers } from '../analytics/consent'
import { ConsentContext } from '../context/ConsentContext'
import { keepAnswers } from '../services/consentCookies'
import { requireContext } from '../../utils'

/**
 * Where the visitor stands on each purpose, and what they do about it:
 * - answer every purpose at once, from the bar's allow-all and reject-all or the dialog's save
 * - open the dialog to choose
 * - close it unanswered
 *
 * Withdrawing a purpose reloads the page, since its loaded script runs until the page unloads. `reopener` is the
 * footer's control that opens the dialog again.
 */
export function useConsent() {
  const { state, dispatch, reopener } = requireContext(useContext(ConsentContext), 'useConsent')

  const answer = (answers: Answers) => {
    keepAnswers(answers)
    if (withdraws(state, nextConsentState(state, { type: 'answer', answers }))) window.location.reload()
    else dispatch({ type: 'answer', answers })
  }

  const choose = () => dispatch({ type: 'choose' })
  const dismiss = () => dispatch({ type: 'dismiss' })

  return { state, answer, choose, dismiss, reopener }
}
