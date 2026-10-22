import type { ComponentProps, ReactNode } from 'react'
import { RemoveIcon } from '../icons/catalog'
import { cx } from '../css'
import styles from './Chip.module.css'

export type ChipColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

interface ChipBaseProps extends Omit<ComponentProps<'span'>, 'className' | 'children'> {
  label: ReactNode
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined'
  color?: ChipColor
  icon?: ReactNode
  className?: string
}

/** A chip the reader can take away ends in a remove button — its glyph says nothing, so `deleteLabel` names it. */
type Deletion = { onDelete: () => void; deleteLabel: string } | { onDelete?: never; deleteLabel?: never }

type ChipProps = ChipBaseProps & Deletion

/** A short state or category, read and never pressed — a chip that filters is a `FilterChip`. */
export function Chip({
  label,
  size = 'medium',
  variant = 'filled',
  color = 'default',
  icon,
  onDelete,
  deleteLabel,
  className,
  ...props
}: ChipProps) {
  return (
    <span className={cx(styles.chip, className)} data-size={size} data-variant={variant} data-color={color} {...props}>
      {icon && (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      )}
      {label}
      {onDelete && (
        <button type="button" className={styles.delete} onClick={onDelete} aria-label={deleteLabel}>
          <RemoveIcon aria-hidden />
        </button>
      )}
    </span>
  )
}

interface FilterChipProps extends Omit<ComponentProps<'button'>, 'className' | 'children' | 'onClick'> {
  label: ReactNode
  selected: boolean
  onClick: () => void
  size?: 'small' | 'medium'
  className?: string
}

/** A chip that narrows a list — pressed while it applies. */
export function FilterChip({ label, selected, onClick, size = 'medium', className, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cx(styles.chip, styles.filter, className)}
      data-size={size}
      data-variant={selected ? 'filled' : 'outlined'}
      data-color={selected ? 'primary' : 'default'}
      {...props}
    >
      {label}
    </button>
  )
}
