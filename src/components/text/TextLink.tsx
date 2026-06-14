import { Link as MuiLink, type LinkProps as MuiLinkProps } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'

type TextLinkProps = Omit<MuiLinkProps, 'component'> & {
  to: string
}

// Base TextLink - use color variants in pages
export function TextLink({ to, sx, ...props }: TextLinkProps) {
  return <MuiLink component={RouterLink} to={to} sx={sx} {...props} />
}

export function TextLinkPrimary({ sx, ...props }: TextLinkProps) {
  const theme = useTheme()
  return <TextLink sx={{ color: theme.palette.primary.main, ...sx }} {...props} />
}
