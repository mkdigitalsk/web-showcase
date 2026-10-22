import type { ReactNode } from 'react'
import { Toast } from '@base-ui/react/toast'
import { CloseIcon, ErrorIcon, type IconComponent, InfoIcon, SuccessIcon, WarningIcon } from '../icons/catalog'
import { useTranslation } from '../../hooks'
import { IconButton } from '../IconButton'
import type { AlertSeverity } from './Alert'
import type { SnackbarData } from './useSnackbar'
import styles from './Snackbar.module.css'

/** How long a notice stays — the pointer or the focus resting on it holds it there. */
const AUTO_HIDE_MS = 3000

const ICONS = {
  error: ErrorIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  info: InfoIcon,
} satisfies Record<AlertSeverity, IconComponent>

/** The notices on screen, each in the colours of an alert of its severity. */
function Notices() {
  const { t } = useTranslation()
  const { toasts } = Toast.useToastManager<SnackbarData>()

  return toasts.map((toast) => {
    const severity = toast.data?.severity ?? 'info'
    const Icon = ICONS[severity]

    return (
      <Toast.Root key={toast.id} toast={toast} className={styles.notice} data-severity={severity}>
        <Icon className={styles.icon} aria-hidden />
        <Toast.Description className={styles.message} />
        <Toast.Close render={<IconButton size="small" aria-label={t('snackbar.close')} />}>
          <CloseIcon aria-hidden />
        </Toast.Close>
      </Toast.Root>
    )
  })
}

/** The one region notices appear in — once, at the root, so `useSnackbar` raises one from any screen. */
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()

  return (
    <Toast.Provider timeout={AUTO_HIDE_MS}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className={styles.viewport} aria-label={t('snackbar.region')}>
          <Notices />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}
