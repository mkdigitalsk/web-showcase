import { Separator } from '@base-ui/react/separator'
import { cx } from '../css'
import styles from './Divider.module.css'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function Divider({ orientation = 'horizontal', className }: DividerProps) {
  return <Separator orientation={orientation} className={cx(styles.divider, className)} />
}

export function DividerPrimary({ className, ...props }: DividerProps) {
  return <Divider {...props} className={cx(styles.action, className)} />
}
