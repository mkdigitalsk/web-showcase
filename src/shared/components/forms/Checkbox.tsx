import { useId, type ReactNode } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { CheckIcon, IndeterminateIcon } from '../icons/catalog'
import { cx } from '../css'
import styles from './Checkbox.module.css'

interface CheckboxProps extends Omit<BaseCheckbox.Root.Props, 'className'> {
  size?: 'small' | 'medium'
  /** The text beside the box, which also toggles it. */
  label?: ReactNode
  /** What ticking the box means, under the label — read out as the box's description, never as its name. */
  description?: ReactNode
  className?: string
}

export function Checkbox({ size = 'medium', label, description, className, indeterminate, ...props }: CheckboxProps) {
  const nameId = useId()
  const descriptionId = useId()
  const described = Boolean(label) && Boolean(description)
  const box = (
    <BaseCheckbox.Root
      className={cx(styles.box, !label && className)}
      data-size={size}
      indeterminate={indeterminate}
      aria-labelledby={described ? nameId : undefined}
      aria-describedby={described ? descriptionId : undefined}
      {...props}
    >
      <BaseCheckbox.Indicator className={styles.indicator} keepMounted>
        {indeterminate ? <IndeterminateIcon aria-hidden /> : <CheckIcon aria-hidden />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
  if (!label) return box

  return (
    <label className={cx(styles.labelled, described && styles.described, className)}>
      {box}
      <span className={styles.words}>
        <span id={nameId}>{label}</span>
        {described && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}
      </span>
    </label>
  )
}
