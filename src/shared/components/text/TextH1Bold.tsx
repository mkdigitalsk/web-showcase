import { useTheme } from '@mui/material/styles'
import { TextH1 } from './TextH1'
import { type BaseTextProps } from './types'

export function TextH1Bold(props: BaseTextProps) {
  return <TextH1 internalSx={{ fontWeight: 'bold' }} {...props} />
}

export function TextH1BoldPrimary(props: BaseTextProps) {
  const theme = useTheme()
  return <TextH1 internalSx={{ fontWeight: 'bold', color: theme.palette.primary.main }} {...props} />
}

export function TextH1BoldNeutral80(props: BaseTextProps) {
  const theme = useTheme()
  return <TextH1 internalSx={{ fontWeight: 'bold', color: theme.palette.neutral[80] }} {...props} />
}
