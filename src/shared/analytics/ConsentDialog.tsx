import { useId, type ReactNode } from 'react'
import { Button, Dialog, TextBody1Neutral60, TextLinkPrimary } from '../components'
import { useConsent, useTranslation } from '../hooks'
import { useCloseOnNavigation } from '../hooks/useCloseOnNavigation'
import { Routes } from '../../utils'
import { answersOf, isAsking, isChoosing } from './consent'
import { ConsentChoiceForm } from './ConsentChoiceForm'

/**
 * Where the visitor chooses a purpose at a time. It opens on what each purpose stands at, a box ticked only where the
 * visitor allowed it, and saves every purpose at once. Once the bar is answered, the dialog closes onto the control
 * that opens it again, the bar's own gone with the answer.
 */
export function ConsentDialog() {
  const { t, intl } = useTranslation()
  const { state, answer, dismiss, reopener } = useConsent()
  const choosing = isChoosing(state)
  const form = useId()
  useCloseOnNavigation(choosing, dismiss)

  return (
    <Dialog
      open={choosing}
      title={t('consent.change')}
      onClose={dismiss}
      finalFocus={isAsking(state) ? undefined : reopener}
      actions={
        <Button type="submit" form={form}>
          {t('consent.dialog.save')}
        </Button>
      }
    >
      <TextBody1Neutral60>
        {intl.formatMessage(
          { id: 'consent.dialog.lead' },
          { link: (chunks: ReactNode[]) => <TextLinkPrimary to={Routes.PRIVACY}>{chunks}</TextLinkPrimary> },
        )}
      </TextBody1Neutral60>
      <ConsentChoiceForm id={form} initial={answersOf(state)} onSave={answer} />
    </Dialog>
  )
}
