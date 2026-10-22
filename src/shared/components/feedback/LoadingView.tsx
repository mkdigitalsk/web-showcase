import type { ComponentPropsWithoutRef } from 'react'
import { cx } from '../css'
import { CircularProgress } from './CircularProgress'
import styles from './LoadingView.module.css'

/** A region's whole content while it loads — the ring, centred in the space the content will take. */
export function LoadingView({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cx(styles.view, className)} {...props}>
      <CircularProgress />
    </div>
  )
}
