import type { ReactNode } from 'react'
import { Radio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { cx } from '../css'
import styles from './RadioButton.module.css'

interface RadioGroupProps extends Omit<BaseRadioGroup.Props, 'className'> {
  row?: boolean
  className?: string
}

/** The set one `RadioButton` of is chosen from — it holds the value and the name. */
export function RadioGroup({ row = false, className, ...props }: RadioGroupProps) {
  return <BaseRadioGroup className={cx(styles.group, className)} data-row={row || undefined} {...props} />
}

interface RadioButtonProps extends Omit<Radio.Root.Props, 'className'> {
  size?: 'small' | 'medium'
  /** The text beside the button, which also picks it. */
  label?: ReactNode
  className?: string
}

export function RadioButton({ size = 'medium', label, className, ...props }: RadioButtonProps) {
  const button = (
    <Radio.Root className={cx(styles.radio, !label && className)} data-size={size} {...props}>
      <Radio.Indicator className={styles.indicator} keepMounted />
    </Radio.Root>
  )
  if (!label) return button

  return (
    <label className={cx(styles.labelled, className)}>
      {button}
      <span>{label}</span>
    </label>
  )
}
