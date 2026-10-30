import type { ReactNode, RefObject } from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import styles from './Dialog.module.css'

interface DialogProps {
  open: boolean
  title?: string
  onClose: () => void
  /**
   * Where the focus goes as it closes, where the control that opened it went with the task — else back to that one.
   */
  finalFocus?: RefObject<HTMLElement | null>
  actions: ReactNode
  children: ReactNode
}

/** A task in its own pane over the page — Escape and the backdrop both close it. */
export function Dialog({ open, title, onClose, finalFocus, actions, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Viewport className={styles.viewport}>
          <BaseDialog.Popup className={styles.popup} finalFocus={finalFocus}>
            {title && <BaseDialog.Title className={styles.title}>{title}</BaseDialog.Title>}
            <div className={styles.content}>{children}</div>
            <div className={styles.actions}>{actions}</div>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
