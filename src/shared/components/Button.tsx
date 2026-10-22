import type { ReactNode } from 'react'
import { Button as BaseButton } from '@base-ui/react/button'
import { useTranslation } from '../hooks'
import { cx } from './css'
import styles from './Button.module.css'

interface ButtonProps extends Omit<BaseButton.Props, 'className'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text'
  size?: 'small' | 'medium'
  startIcon?: ReactNode
  loading?: boolean
  /** The variant's shape in the error colour. */
  destructive?: boolean
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  startIcon,
  loading = false,
  destructive = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const { t } = useTranslation()

  return (
    <BaseButton
      className={cx(styles.button, className)}
      data-variant={variant}
      data-size={size}
      data-destructive={destructive || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {startIcon && (
        <span className={styles.icon} aria-hidden>
          {startIcon}
        </span>
      )}
      {loading ? t('common.loading') : children}
    </BaseButton>
  )
}
