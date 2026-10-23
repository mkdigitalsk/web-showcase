import type { ReactNode } from 'react'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import { Button } from '../Button'
import styles from './Dialog.module.css'

interface AlertDialogProps {
  open: boolean
  title: string
  text?: string
  confirmText: string
  dismissText: string
  destructive?: boolean
  onConfirm: () => void
  onDismiss: () => void
  children?: ReactNode
}

/** A question that must be answered before the page goes on — only its two buttons and Escape leave it. */
export function AlertDialog({
  open,
  title,
  text,
  confirmText,
  dismissText,
  destructive = false,
  onConfirm,
  onDismiss,
  children,
}: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root open={open} onOpenChange={(next) => !next && onDismiss()}>
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={styles.backdrop} />
        <BaseAlertDialog.Viewport className={styles.viewport}>
          <BaseAlertDialog.Popup className={styles.popup}>
            <BaseAlertDialog.Title className={styles.title}>{title}</BaseAlertDialog.Title>
            {text && <BaseAlertDialog.Description className={styles.description}>{text}</BaseAlertDialog.Description>}
            {children && <div className={styles.content}>{children}</div>}
            <div className={styles.actions}>
              <Button variant="text" onClick={onDismiss}>
                {dismissText}
              </Button>
              <Button destructive={destructive} onClick={onConfirm}>
                {confirmText}
              </Button>
            </div>
          </BaseAlertDialog.Popup>
        </BaseAlertDialog.Viewport>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  )
}
