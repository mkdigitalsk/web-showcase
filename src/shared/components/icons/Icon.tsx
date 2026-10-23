import { cx } from '../css'
import type { IconComponent } from './catalog'
import styles from './Icon.module.css'

/** The sizes a glyph is drawn at — `inherit` is the size of the text it sits in. */
export type IconSize = 'small' | 'medium' | 'large' | 'inherit'

interface IconProps {
  /** Handed over by its import from the catalogue — a glyph looked up by a name at run time ships every glyph. */
  glyph: IconComponent
  size?: IconSize
  color?: string
  className?: string
}

/**
 * A decorative glyph at one of the scale's sizes. The size is set in CSS, where a rule of the page's own can still
 * reach it — a size on the glyph itself loses to any rule that sizes it.
 *
 * @see {@link https://lucide.dev/guide/react/basics/sizing | Lucide — Sizing}
 */
export function Icon({ glyph: Glyph, size = 'medium', color, className }: IconProps) {
  return <Glyph className={cx(styles.icon, className)} data-size={size} color={color} aria-hidden />
}
