import { Lockup, Mark } from '@mkdigitalsk/design-system/mark'
import { cx, cssVars } from '../css'
import styles from './Logo.module.css'

interface LogoProps {
  variant?: 'mark' | 'lockup'
  className?: string
}

/** The bars' colours, top to bottom — the tokens follow the scheme. */
const FILLS = ['var(--mark-0)', 'var(--mark-1)', 'var(--mark-2)']

/**
 * The logo as an inline SVG drawn from the design system's paths: the mark alone, or the mark before the outlined
 * name — so it cannot drift from the design system's files, and needs no font. Its height is the name's em.
 */
export function Logo({ variant = 'lockup', className }: LogoProps) {
  const lockup = variant === 'lockup'
  const box = lockup ? Lockup : Mark

  return (
    <svg
      role="img"
      aria-label="MK Digital"
      viewBox={`0 0 ${box.width} ${box.height}`}
      className={cx(styles.logo, className)}
      style={cssVars({ '--logo-height': `${box.height / Mark.em}em` })}
    >
      <g transform={lockup ? `translate(${Lockup.mark.x} ${Lockup.mark.y})` : undefined}>
        {Mark.bars.map((d, i) => (
          <path key={d} d={d} fill={FILLS[i]} />
        ))}
      </g>
      {lockup && (
        <path
          d={Lockup.wordmark.d}
          transform={`translate(${Lockup.wordmark.x} ${Lockup.wordmark.y})`}
          fill="var(--mark-0)"
        />
      )}
    </svg>
  )
}
