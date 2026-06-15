import { type SxProps } from '@mui/material'
import { BaseTypography } from './BaseTypography'
import { type BaseTextProps } from './types'

interface TextH6InternalProps extends BaseTextProps {
  internalSx?: SxProps
}

export function TextH6({ internalSx, ...props }: TextH6InternalProps) {
  return <BaseTypography variant="h6" internalSx={internalSx} {...props} />
}
