import { useId } from 'react'
import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { Brand, Light, Dark } from '../../theme/color'

type LogoVariant = 'mark' | 'wordmark' | 'lockup'

interface LogoProps {
  variant?: LogoVariant
  height?: number
  /**
   * Forces the light-on-dark stack (the navy brand bar, the footer) regardless of page scheme; otherwise
   * the colours adapt light↔dark via CSS vars, so a standalone placement still follows the theme.
   */
  onDark?: boolean
  sx?: SxProps<Theme>
}

const FONT = "'Plus Jakarta Sans','Inter','Helvetica Neue',Arial,sans-serif"

type SxArray = Extract<SxProps<Theme>, readonly unknown[]>

/** Array.isArray widens the union to any[]; the annotation restores the element type. */
function toSxArray(sx: SxProps<Theme> | undefined): SxArray {
  const sxArray: SxArray = Array.isArray(sx) ? sx : sx ? [sx] : []
  return sxArray
}

/**
 * Fixed inline SVG, not live HTML text: it cannot wrap, reflow or collide, scales crisply and lays out
 * independently of the font. The geometry is the canonical lockup (design-system mk-digital-lockup.svg):
 * tight stripes, dual-tone MK.
 */
export function Logo({ variant = 'wordmark', height = 28, onDark = false, sx }: LogoProps) {
  const uid = useId().replace(/:/g, '')
  const isMark = variant === 'mark'
  const isLockup = variant === 'lockup'
  const sxArray = toSxArray(sx)

  const scheme = onDark
    ? [{ '--s0': Dark.stack[0], '--s1': Dark.stack[1], '--tl': Brand.teal }]
    : [
        { '--s0': Light.stack[0], '--s1': Light.stack[1], '--tl': Brand.tealDark },
        (t: Theme) => t.applyStyles('dark', { '--s0': Dark.stack[0], '--s1': Dark.stack[1], '--tl': Brand.teal }),
      ]

  if (isMark) {
    return (
      <Box
        component="svg"
        role="img"
        aria-label="MK Digital"
        viewBox="0 0 64 64"
        sx={[{ height, width: height, display: 'block', flexShrink: 0 }, ...scheme, ...sxArray]}
      >
        <rect x="10" y="10" width="44" height="12" rx="3" fill="var(--s0)" />
        <rect x="10" y="26" width="44" height="12" rx="3" fill="var(--s1)" />
        <rect x="10" y="42" width="44" height="12" rx="3" fill={Brand.teal} />
      </Box>
    )
  }

  const clip = `mk-${uid}`
  const grad = `rf-${uid}`

  return (
    <Box
      component="svg"
      role="img"
      aria-label="MK Digital — Software Studio"
      viewBox="0 8 244 60"
      sx={[{ height, width: 'auto', display: 'block', flexShrink: 0 }, ...scheme, ...sxArray]}
    >
      <defs>
        <clipPath id={clip}>
          <text x="66" y="44" fontFamily={FONT} fontWeight="800" fontSize="38" letterSpacing="-1.4">
            MK
          </text>
        </clipPath>
        {isLockup && (
          <linearGradient id={grad} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--tl)" stopOpacity="0" />
            <stop offset="0.12" stopColor="var(--tl)" />
            <stop offset="0.88" stopColor="var(--tl)" />
            <stop offset="1" stopColor="var(--tl)" stopOpacity="0" />
          </linearGradient>
        )}
      </defs>
      <rect x="8" y="16" width="44" height="12" rx="3" fill="var(--s0)" />
      <rect x="8" y="32" width="44" height="12" rx="3" fill="var(--s1)" />
      <rect x="8" y="48" width="44" height="12" rx="3" fill={Brand.teal} />
      <text x="66" y="44" fontFamily={FONT} fontWeight="800" fontSize="38" letterSpacing="-1.4" fill="var(--s0)">
        MKDigital
      </text>
      <g clipPath={`url(#${clip})`}>
        <rect x="58" y="0" width="100" height="32" fill="var(--s0)" />
        <rect x="58" y="32" width="100" height="40" fill="var(--s1)" />
      </g>
      {isLockup && <rect x="66" y="48" width="168" height="1.6" fill={`url(#${grad})`} />}
      {isLockup && (
        <text
          x="66"
          y="57.5"
          fontFamily={FONT}
          fontWeight="600"
          fontSize="9"
          letterSpacing="0.5"
          textLength="168"
          lengthAdjust="spacing"
          fill="var(--tl)"
        >
          SOFTWARE STUDIO
        </text>
      )}
    </Box>
  )
}
