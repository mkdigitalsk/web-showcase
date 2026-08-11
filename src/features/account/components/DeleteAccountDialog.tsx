import { Stack } from '@mui/material'
import { AlertError, Button, CircularProgress, Dialog, TextBody1Neutral60 } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { requestErrorKey } from '../../../shared/api'

interface DeleteAccountDialogProps {
  error: Error | null
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteAccountDialog({ error, isDeleting, onCancel, onConfirm }: DeleteAccountDialogProps) {
  const { t } = useTranslation()

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
          {/* Not the wrapper's `loading`, which swaps the label for an English literal in every locale. */}
          <Button
            color="error"
            onClick={onConfirm}
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {t('account.deleteConfirm')}
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        <TextBody1Neutral60>{t('account.deleteBody')}</TextBody1Neutral60>
        {error && <AlertError>{t(requestErrorKey(error, 'account.deleteFailed'))}</AlertError>}
      </Stack>
    </Dialog>
  )
}
