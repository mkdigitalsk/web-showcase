import { AlertError, Button, Dialog, TextBody1Neutral60 } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { httpStatus, requestErrorKey } from '../../../shared/api'

interface DeleteAccountDialogProps {
  error: Error | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

const REFUSED = 403

/** The server refuses a demo account outright, so the retry the fallback asks for can never succeed. */
const deleteErrorKey = (error: Error | null) =>
  httpStatus(error) === REFUSED ? 'account.deleteDemo' : requestErrorKey(error, 'account.deleteFailed')

export function DeleteAccountDialog({ error, isDeleting, onCancel, onConfirm }: DeleteAccountDialogProps) {
  const { t } = useTranslation()
  const errorKey = deleteErrorKey(error)

  return (
    <Dialog
      open
      title={t('account.deleteTitle')}
      onClose={onCancel}
      actions={
        <>
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            {t('account.deleteCancel')}
          </Button>
          <Button destructive onClick={onConfirm} loading={isDeleting}>
            {t('account.deleteConfirm')}
          </Button>
        </>
      }
    >
      <TextBody1Neutral60>{t('account.deleteBody')}</TextBody1Neutral60>
      {error && <AlertError>{t(errorKey)}</AlertError>}
    </Dialog>
  )
}
