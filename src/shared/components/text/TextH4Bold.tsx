import { useTheme } from '@mui/material/styles'
import { TextH4 } from './TextH4'
import { type BaseTextProps } from './types'

export function TextH4Bold(props: BaseTextProps) {
  return <TextH4 internalSx={{ fontWeight: 'bold' }} {...props} />
}

export function TextH4BoldPrimary(props: BaseTextProps) {
  const theme = useTheme()
  return <TextH4 internalSx={{ fontWeight: 'bold', color: theme.palette.primary.main }} {...props} />
}

export function TextH4BoldNeutral80(props: BaseTextProps) {
  const theme = useTheme()
  return <TextH4 internalSx={{ fontWeight: 'bold', color: theme.palette.neutral[80] }} {...props} />
}
