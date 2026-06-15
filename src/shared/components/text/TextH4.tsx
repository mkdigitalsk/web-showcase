import { BaseTypography } from './BaseTypography'
import { type TextInternalProps } from './types'

export function TextH4({ internalSx, ...props }: TextInternalProps) {
  return <BaseTypography variant="h4" internalSx={internalSx} {...props} />
}
