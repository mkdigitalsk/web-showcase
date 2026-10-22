import { useRef } from 'react'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import { Button } from '../Button'
import styles from './Dialog.module.css'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  text: string
  confirmText?: string
  onConfirm: () => void
}

/** A notice with one way out — reading it is the confirmation, so closing it by any means confirms. */
export function ConfirmDialog({ open, title, text, confirmText = 'OK', onConfirm }: ConfirmDialogProps) {
  const confirm = useRef<HTMLButtonElement>(null)

  return (
    <BaseAlertDialog.Root open={open} onOpenChange={(next) => !next && onConfirm()}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={styles.backdrop} />
        <BaseAlertDialog.Viewport className={styles.viewport}>
          <BaseAlertDialog.Popup className={styles.popup} initialFocus={confirm}>
            {title && <BaseAlertDialog.Title className={styles.title}>{title}</BaseAlertDialog.Title>}
            <BaseAlertDialog.Description className={styles.description}>{text}</BaseAlertDialog.Description>
            <div className={styles.actions}>
              <Button ref={confirm} onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </BaseAlertDialog.Popup>
        </BaseAlertDialog.Viewport>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  )
}
