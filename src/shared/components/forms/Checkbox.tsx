import type { ReactNode } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { CheckIcon, IndeterminateIcon } from '../icons/catalog'
import { cx } from '../css'
import styles from './Checkbox.module.css'

interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, 'className'> {
  size?: 'small' | 'medium'
  /** The text beside the box, which also toggles it. */
  label?: ReactNode
  className?: string
}

export function Checkbox({ size = 'medium', label, className, indeterminate, ...props }: CheckboxProps) {
  const box = (
    <BaseCheckbox.Root
      className={cx(styles.box, !label && className)}
      data-size={size}
      indeterminate={indeterminate}
      {...props}
    >
      <BaseCheckbox.Indicator className={styles.indicator} keepMounted>
        {indeterminate ? <IndeterminateIcon aria-hidden /> : <CheckIcon aria-hidden />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
  if (!label) return box

  return (
    <label className={cx(styles.labelled, className)}>
      {box}
      <span>{label}</span>
    </label>
  )
}
