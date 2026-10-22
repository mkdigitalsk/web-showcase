import { Progress } from '@base-ui/react/progress'
import { useTranslation } from '../../hooks'
import { cx, cssVars } from '../css'
import styles from './CircularProgress.module.css'

interface CircularProgressProps {
  /** The ring's diameter, in px. */
  size?: number
  'aria-label'?: string
  className?: string
}

/** A ring that turns until what it waits for arrives. */
export function CircularProgress({ size = 40, 'aria-label': label, className }: CircularProgressProps) {
  const { t } = useTranslation()

  return (
    <Progress.Root
      value={null}
      aria-label={label ?? t('common.loading')}
      className={cx(styles.root, className)}
      style={cssVars({ '--size': `${size}px` })}
    >
      <svg className={styles.ring} viewBox="0 0 40 40" aria-hidden>
        <circle cx="20" cy="20" r="17" />
      </svg>
    </Progress.Root>
  )
}
