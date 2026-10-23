import { Button as BaseButton } from '@base-ui/react/button'
import { cx } from './css'
import styles from './IconButton.module.css'

interface IconButtonProps extends Omit<BaseButton.Props, 'className'> {
  /** The action, since the glyph says nothing to a screen reader. */
  'aria-label': string
  size?: 'small' | 'medium'
  tone?: 'default' | 'action' | 'error'
  className?: string
}

/** A square control holding one glyph — the glyph itself stays `aria-hidden`, or it is announced twice. */
export function IconButton({ size = 'medium', tone = 'default', className, ...props }: IconButtonProps) {
  return <BaseButton className={cx(styles.button, className)} data-size={size} data-tone={tone} {...props} />
}
