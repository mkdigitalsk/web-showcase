import { Badge as MuiBadge, type BadgeProps as MuiBadgeProps } from '@mui/material'

const DEFAULT_MAX_COUNT = 99

type BadgeProps = MuiBadgeProps

export function Badge({ sx, ...props }: BadgeProps) {
  return <MuiBadge color="error" sx={sx} {...props} />
}

type BadgedBoxProps = Omit<MuiBadgeProps, 'badgeContent'> & {
  count: number
  maxCount?: number
  showBadge?: boolean
}

export function BadgedBox({
  count,
  maxCount = DEFAULT_MAX_COUNT,
  showBadge = count > 0,
  sx,
  children,
  ...props
}: BadgedBoxProps) {
  return (
    <MuiBadge
      badgeContent={showBadge ? (count > maxCount ? `${maxCount}+` : count) : 0}
      color="error"
      invisible={!showBadge}
      sx={sx}
      {...props}
    >
      {children}
    </MuiBadge>
  )
}

type DotBadgedBoxProps = Omit<MuiBadgeProps, 'badgeContent' | 'variant'> & {
  showBadge: boolean
}

export function DotBadgedBox({ showBadge, sx, children, ...props }: DotBadgedBoxProps) {
  return (
    <MuiBadge variant="dot" color="error" invisible={!showBadge} sx={sx} {...props}>
      {children}
    </MuiBadge>
  )
}
