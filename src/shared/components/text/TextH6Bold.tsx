import { useTheme } from '@mui/material/styles'
import { TextH6 } from './TextH6'
import { type BaseTextProps } from './types'

export function TextH6Bold(props: BaseTextProps) {
  return <TextH6 internalSx={{ fontWeight: 'bold' }} {...props} />
}

export function TextH6BoldPrimary(props: BaseTextProps) {
  const theme = useTheme()
  return <TextH6 internalSx={{ fontWeight: 'bold', color: theme.palette.primary.main }} {...props} />
}

export function TextH6BoldNeutral80(props: BaseTextProps) {
  const theme = useTheme()
  return <TextH6 internalSx={{ fontWeight: 'bold', color: theme.palette.neutral[80] }} {...props} />
}
