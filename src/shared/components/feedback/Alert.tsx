import type { ReactNode } from 'react'
import { ErrorIcon, type IconComponent, InfoIcon, SuccessIcon, WarningIcon } from '../icons/catalog'
import { cx } from '../css'
import styles from './Alert.module.css'

export type AlertSeverity = 'error' | 'success' | 'warning' | 'info'

interface AlertProps {
  severity: AlertSeverity
  children: ReactNode
  /** What the reader can do about it, at the line's end. */
  action?: ReactNode
  className?: string
}

const ICONS = {
  error: ErrorIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  info: InfoIcon,
} satisfies Record<AlertSeverity, IconComponent>

/** A line that stays on the page — an error interrupts, the rest wait to be read. */
export function Alert({ severity, children, action, className }: AlertProps) {
  const Icon = ICONS[severity]

  return (
    <div
      role={severity === 'error' ? 'alert' : 'status'}
      className={cx(styles.alert, className)}
      data-severity={severity}
    >
      <Icon className={styles.icon} aria-hidden />
      <div className={styles.body}>{children}</div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}

type SeverityAlertProps = Omit<AlertProps, 'severity'>

export function AlertError(props: SeverityAlertProps) {
  return <Alert severity="error" {...props} />
}

export function AlertSuccess(props: SeverityAlertProps) {
  return <Alert severity="success" {...props} />
}

export function AlertWarning(props: SeverityAlertProps) {
  return <Alert severity="warning" {...props} />
}

export function AlertInfo(props: SeverityAlertProps) {
  return <Alert severity="info" {...props} />
}
