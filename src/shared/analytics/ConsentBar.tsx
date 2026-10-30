import type { ReactNode } from 'react'
import { Button, TextBody1Neutral80, TextLinkPrimary } from '../components'
import { CheckIcon, ChooseIcon, RejectIcon } from '../components/icons/catalog'
import { useConsent, useTranslation } from '../hooks'
import { useScrollPaddingBottom } from '../hooks/useScrollPaddingBottom'
import { Routes } from '../../utils'
import { isAsking, sameAnswer, type Consent } from './consent'
import styles from './ConsentBar.module.css'

/**
 * The bar asking whether the showcase may measure and record errors — allow all and reject all side by side at one
 * weight, and beside them the way to choose a purpose at a time in the dialog. It keeps to the window's foot without
 * blocking the page, so a visitor who never answers still uses the whole showcase. An answer takes the bar away, the
 * button it was given with too, so the focus goes on to the footer's control that opens the choice again.
 *
 * @see {@link https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html | Understanding SC 2.4.3: Focus Order}
 * @see {@link https://www.edpb.europa.eu/system/files/documents/files/file1/edpb_guidelines_202005_consent_en.pdf#page=14 | EDPB — Guidelines 05/2020 on consent under Regulation 2016/679, paragraph 60}
 */
export function ConsentBar() {
  const { t, intl } = useTranslation()
  const { state, answer, choose, reopener } = useConsent()
  const clearOfBar = useScrollPaddingBottom()

  if (!isAsking(state)) return null

  const answerAll = (consent: Consent) => {
    answer(sameAnswer(consent))
    reopener.current?.focus()
  }

  return (
    <section ref={clearOfBar} aria-label={t('consent.label')} className={styles.bar}>
      <div className={styles.row}>
        <div className={styles.words}>
          <TextBody1Neutral80>
            {intl.formatMessage(
              { id: 'consent.text' },
              {
                settings: t('consent.change'),
                link: (chunks: ReactNode[]) => <TextLinkPrimary to={Routes.PRIVACY}>{chunks}</TextLinkPrimary>,
              },
            )}
          </TextBody1Neutral80>
        </div>
        <div className={styles.answers}>
          <Button variant="outline" startIcon={<ChooseIcon />} onClick={choose}>
            {t('consent.choose')}
          </Button>
          <Button variant="outline" startIcon={<RejectIcon />} onClick={() => answerAll('denied')}>
            {t('consent.rejectAll')}
          </Button>
          <Button variant="outline" startIcon={<CheckIcon />} onClick={() => answerAll('granted')}>
            {t('consent.allowAll')}
          </Button>
        </div>
      </div>
    </section>
  )
}
