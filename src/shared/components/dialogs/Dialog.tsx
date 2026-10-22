import type { ReactNode } from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import styles from './Dialog.module.css'

interface DialogProps {
  open: boolean
  title?: string
  onClose: () => void
  actions: ReactNode
  children: ReactNode
}

/** A task in its own pane over the page — Escape and the backdrop both close it. */
export function Dialog({ open, title, onClose, actions, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Viewport className={styles.viewport}>
          <BaseDialog.Popup className={styles.popup}>
            {title && <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>}
            <div className={styles.content}>{children}</div>
            <div className={styles.actions}>{actions}</div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
