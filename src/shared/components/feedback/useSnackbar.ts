import { Toast } from '@base-ui/react/toast'
import type { AlertSeverity } from './Alert'

/** What a notice carries beside its message. */
export interface SnackbarData {
  severity: AlertSeverity
}

/** Raises a notice that goes on its own, in the region the root's `SnackbarProvider` renders. */
export function useSnackbar() {
  const { add } = Toast.useToastManager<SnackbarData>()

  return {
    show: (message: string, severity: AlertSeverity) => add({ description: message, data: { severity } }),
  }
}
