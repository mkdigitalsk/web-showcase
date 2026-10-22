import { Progress } from '@base-ui/react/progress'
import { useTranslation } from '../../hooks'
import { cx } from '../css'
import styles from './LinearProgress.module.css'

interface LinearProgressProps {
  /** How far along, 0–100. Unset, the bar sweeps. */
  value?: number
  'aria-label'?: string
  className?: string
}

export function LinearProgress({ value, 'aria-label': label, className }: LinearProgressProps) {
  const { t } = useTranslation()

  return (
    <Progress.Root
      value={value ?? null}
      aria-label={label ?? t('common.loading')}
      className={cx(styles.root, className)}
    >
      <Progress.Track className={styles.track}>
        <Progress.Indicator className={styles.indicator} />
      </Progress.Track>
    </Progress.Root>
  )
}
