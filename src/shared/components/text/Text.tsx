import type { ElementType } from 'react'
import { cx } from '../css'
import type { BaseTextProps, TextTone } from './types'
import styles from './Text.module.css'

/** The type scale's roles, each a `--font-*` token. */
export type TextVariant =
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline'

interface TextProps extends BaseTextProps {
  /** The role; body text when none is named. */
  variant?: TextVariant
  tone?: TextTone
  bold?: boolean
  /** The element, when not the role's own. */
  as?: ElementType
}

/** The element each role renders when the caller names none — a heading its heading, the rest a paragraph. */
const ELEMENT_OF = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'p',
  subtitle2: 'p',
  body1: 'p',
  body2: 'p',
  caption: 'p',
  overline: 'p',
} as const satisfies Record<TextVariant, ElementType>

/** The one text element — typed by role and tone, never by size or colour. */
export function Text({
  variant = 'body1',
  tone = 'ink',
  bold = false,
  as,
  align,
  gutterBottom = false,
  noWrap = false,
  className,
  ...props
}: TextProps) {
  const Element: ElementType = as ?? ELEMENT_OF[variant]

  return (
    <Element
      className={cx(styles.text, gutterBottom && styles.gutter, className)}
      data-variant={variant}
      data-tone={tone}
      data-bold={bold || undefined}
      data-nowrap={noWrap || undefined}
      data-align={align}
      {...props}
    />
  )
}
