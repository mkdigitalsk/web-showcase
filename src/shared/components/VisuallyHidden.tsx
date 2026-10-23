import type { ComponentProps } from 'react'
import { cx } from './css'
import styles from './VisuallyHidden.module.css'

/** Words for a screen reader alone — a name or a reason the eye takes from the layout. */
export function VisuallyHidden({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cx(styles.hidden, className)} {...props} />
}
