import { useState } from 'react'
import { AlertDialog, Button, ConfirmDialog, useSnackbar } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { Section } from './Section'
import styles from './DialogsSection.module.css'

export function DialogsSection() {
  const { t } = useTranslation()
  const snackbar = useSnackbar()
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  return (
    <Section title={t('uiComponents.dialogs')}>
      <div className={styles.actions}>
        <Button variant="outline" onClick={() => setAlertDialogOpen(true)}>
          {t('uiComponents.dialogs.openAlert')}
        </Button>
        <Button variant="outline" onClick={() => setConfirmDialogOpen(true)}>
          {t('uiComponents.dialogs.openConfirm')}
        </Button>
        <Button variant="outline" onClick={() => snackbar.show(t('uiComponents.dialogs.snackbarMessage'), 'success')}>
          {t('uiComponents.dialogs.openSnackbar')}
        </Button>
      </div>
      <AlertDialog
        open={alertDialogOpen}
        title={t('uiComponents.dialogs.alertTitle')}
        text={t('uiComponents.dialogs.alertText')}
        confirmText={t('uiComponents.dialogs.alertConfirm')}
        dismissText={t('uiComponents.dialogs.alertDismiss')}
        onConfirm={() => setAlertDialogOpen(false)}
        onDismiss={() => setAlertDialogOpen(false)}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        title={t('uiComponents.dialogs.confirmTitle')}
        text={t('uiComponents.dialogs.confirmText')}
        onConfirm={() => setConfirmDialogOpen(false)}
      />
    </Section>
  )
}
