import { type SxProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BaseTypography } from './BaseTypography'
import { type BaseTextProps } from './types'

interface TextBody1InternalProps extends BaseTextProps {
  internalSx?: SxProps
}

export function TextBody1({ internalSx, ...props }: TextBody1InternalProps) {
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
