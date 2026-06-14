import { type ComponentProps } from 'react'
import { useTheme } from '@mui/material/styles'
import { TextH6 } from './TextH6'

type TextH6BoldProps = Omit<ComponentProps<typeof TextH6>, 'fontWeight'>

export function TextH6Bold({ sx, ...props }: TextH6BoldProps) {
  return <TextH6 sx={{ fontWeight: 'bold', ...sx }} {...props} />
}

export function TextH6BoldPrimary({ sx, ...props }: TextH6BoldProps) {
  const theme = useTheme()
  return <TextH6Bold sx={{ color: theme.palette.primary.main, ...sx }} {...props} />
}

export function TextH6BoldNeutral80({ sx, ...props }: TextH6BoldProps) {
  const theme = useTheme()
  return <TextH6Bold sx={{ color: theme.palette.neutral[80], ...sx }} {...props} />
}
