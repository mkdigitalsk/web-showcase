import { useTheme } from '@mui/material/styles'
import { BaseTypography } from './BaseTypography'
import { type BaseTextProps, type TextInternalProps } from './types'

export function TextCaption({ internalSx, ...props }: TextInternalProps) {
  return <BaseTypography variant="caption" internalSx={internalSx} {...props} />
}

export function TextCaptionNeutral60(props: BaseTextProps) {
  const theme = useTheme()
  return <TextCaption internalSx={{ color: theme.palette.neutral[60] }} {...props} />
}

export function TextCaptionNeutral40(props: BaseTextProps) {
  const theme = useTheme()
  return <TextCaption internalSx={{ color: theme.palette.neutral[40] }} {...props} />
}
