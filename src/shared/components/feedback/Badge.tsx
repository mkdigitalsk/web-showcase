import type { ReactNode } from 'react'
import { cx } from '../css'
import styles from './Badge.module.css'

interface BadgeProps {
  /** The count, or nothing for a dot. */
  content?: ReactNode
  invisible?: boolean
  variant?: 'count' | 'dot'
  /** Red for what needs attention, neutral for a plain count. */
  tone?: 'error' | 'neutral'
  className?: string
  children: ReactNode
}

export function Badge({
  content,
  invisible = false,
  variant = 'count',
  tone = 'error',
  className,
  children,
}: BadgeProps) {
  return (
    <span className={cx(styles.anchor, className)}>
      {children}
      {!invisible && (
        <span className={styles.badge} data-variant={variant} data-tone={tone}>
          {variant === 'count' && content}
        </span>
      )}
    </span>
  )
}

const DEFAULT_MAX_COUNT = 99

interface BadgedBoxProps extends Omit<BadgeProps, 'content' | 'invisible' | 'variant'> {
  count: number
  maxCount?: number
  showBadge?: boolean
}

export function BadgedBox({ count, maxCount = DEFAULT_MAX_COUNT, showBadge = count > 0, ...props }: BadgedBoxProps) {
  return <Badge content={count > maxCount ? `${maxCount}+` : count} invisible={!showBadge} {...props} />
}

interface DotBadgedBoxProps extends Omit<BadgeProps, 'content' | 'invisible' | 'variant'> {
  showBadge: boolean
}

export function DotBadgedBox({ showBadge, ...props }: DotBadgedBoxProps) {
  return <Badge variant="dot" invisible={!showBadge} {...props} />
}
