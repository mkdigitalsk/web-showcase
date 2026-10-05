import Box from '@mui/material/Box'
import type { SxProps, Theme, TypographyVariant } from '@mui/material/styles'
import { Lockup, Mark } from '@mkdigitalsk/design-system/mark'
import { Light, Dark } from '../../theme/color'

type LogoVariant = 'mark' | 'lockup'

interface LogoProps {
  variant?: LogoVariant
  /** The name's type — the logo is drawn in its em. */
  type?: TypographyVariant
  /** The on-dark colours whatever the page's scheme — unset, the logo follows the theme. */
  onDark?: boolean
  sx?: SxProps<Theme>
}

type SxArray = Extract<SxProps<Theme>, readonly unknown[]>

/** Array.isArray widens the union to any[]; the annotation restores the element type. */
function toSxArray(sx: SxProps<Theme> | undefined): SxArray {
  const sxArray: SxArray = Array.isArray(sx) ? sx : sx ? [sx] : []
  return sxArray
}

const FILLS = ['var(--s0)', 'var(--s1)', 'var(--s2)']

/**
 * The logo as an inline SVG drawn from the design system's paths: the mark alone, or the mark before the outlined
 * name — so it cannot drift from the design system's files, and needs no font.
 */
export function Logo({ variant = 'lockup', type = 'h6', onDark = false, sx }: LogoProps) {
  const lockup = variant === 'lockup'
  const box = lockup ? Lockup : Mark
  const dark = { '--s0': Dark.stack[0], '--s1': Dark.stack[1], '--s2': Dark.stack[2] }
  const scheme = onDark
    ? [dark]
    : [
        { '--s0': Light.stack[0], '--s1': Light.stack[1], '--s2': Light.stack[2] },
        (t: Theme) => t.applyStyles('dark', dark),
      ]

  return (
    <Box
      component="svg"
      role="img"
      aria-label="MK Digital"
      viewBox={`0 0 ${box.width} ${box.height}`}
      sx={[
        { typography: type, height: `${box.height / Mark.em}em`, width: 'auto', display: 'block', flexShrink: 0 },
        ...scheme,
        ...toSxArray(sx),
      ]}
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
          fill="var(--s0)"
        />
      )}
    </Box>
  )
}
