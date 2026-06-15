import { type SxProps } from '@mui/material'
import { BaseTypography } from './BaseTypography'
import { type BaseTextProps } from './types'

interface TextH4InternalProps extends BaseTextProps {
  internalSx?: SxProps
}

export function TextH4({ internalSx, ...props }: TextH4InternalProps) {
  return <BaseTypography variant="h4" internalSx={internalSx} {...props} />
}
