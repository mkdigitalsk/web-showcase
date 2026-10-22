import type { ReactNode } from 'react'
import { Field } from '@base-ui/react/field'
import { cx } from '../css'
import styles from './FieldFrame.module.css'

/** What every field shares — the label above, the control's box, the line beneath it. */
export interface FieldFrameProps {
  label?: string
  /** Set, the field turns red; `errorText` sets it and says why beneath. */
  error?: boolean
  errorText?: string
  helperText?: ReactNode
  size?: 'small' | 'medium'
  disabled?: boolean
  /** A control at the field's end — a unit, a clear, a picker. */
  endAdornment?: ReactNode
  className?: string
}

/** The frame around one control, its child. */
export function FieldFrame({
  label,
  error = false,
  errorText,
  helperText,
  size = 'medium',
  disabled,
  endAdornment,
  className,
  children,
}: FieldFrameProps & { children: ReactNode }) {
  return (
    <Field.Root
      invalid={error || Boolean(errorText)}
      disabled={disabled}
      className={cx(styles.field, className)}
      data-size={size}
    >
      {label && <Field.Label className={styles.label}>{label}</Field.Label>}
      <div className={styles.control}>
        {children}
        {endAdornment && <span className={styles.adornment}>{endAdornment}</span>}
      </div>
      {errorText ? (
        <Field.Error match className={styles.error}>
          {errorText}
        </Field.Error>
      ) : (
        helperText && <Field.Description className={styles.helper}>{helperText}</Field.Description>
      )}
    </Field.Root>
  )
}
