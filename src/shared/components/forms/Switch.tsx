import type { ReactNode } from 'react'
import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { cx } from '../css'
import styles from './Switch.module.css'

interface SwitchProps extends Omit<BaseSwitch.Root.Props, 'className'> {
  /** The text beside the switch, which also flips it. */
  label?: ReactNode
  className?: string
}

export function Switch({ label, className, ...props }: SwitchProps) {
  const control = (
    <BaseSwitch.Root className={cx(styles.track, !label && className)} {...props}>
      <BaseSwitch.Thumb className={styles.thumb} />
    </BaseSwitch.Root>
  )
  if (!label) return control

  return (
    <label className={cx(styles.labelled, className)}>
      {control}
      <span>{label}</span>
    </label>
  )
}
