import { useTheme } from '@mui/material/styles'
import { BaseTypography } from './BaseTypography'
import { type BaseTextProps, type TextInternalProps } from './types'

export function TextBody1({ internalSx, ...props }: TextInternalProps) {
  return <BaseTypography variant="body1" internalSx={internalSx} {...props} />
}

export function TextBody1Neutral80(props: BaseTextProps) {
  const theme = useTheme()
  return <TextBody1 internalSx={{ color: theme.palette.neutral[80] }} {...props} />
}

export function TextBody1Neutral60(props: BaseTextProps) {
  const theme = useTheme()
  return <TextBody1 internalSx={{ color: theme.palette.neutral[60] }} {...props} />
}

export function TextBody1Primary(props: BaseTextProps) {
  const theme = useTheme()
  return <TextBody1 internalSx={{ color: theme.palette.primary.main }} {...props} />
}
