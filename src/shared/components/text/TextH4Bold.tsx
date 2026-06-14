import { type ComponentProps } from 'react'
import { useTheme } from '@mui/material/styles'
import { TextH4 } from './TextH4'

type TextH4BoldProps = Omit<ComponentProps<typeof TextH4>, 'fontWeight'>

export function TextH4Bold({ sx, ...props }: TextH4BoldProps) {
  return <TextH4 sx={{ fontWeight: 'bold', ...sx }} {...props} />
}

export function TextH4BoldPrimary({ sx, ...props }: TextH4BoldProps) {
  const theme = useTheme()
  return <TextH4Bold sx={{ color: theme.palette.primary.main, ...sx }} {...props} />
}

export function TextH4BoldNeutral80({ sx, ...props }: TextH4BoldProps) {
  const theme = useTheme()
  return <TextH4Bold sx={{ color: theme.palette.neutral[80], ...sx }} {...props} />
}
