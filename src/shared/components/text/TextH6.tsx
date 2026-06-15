import { BaseTypography } from './BaseTypography'
import { type TextInternalProps } from './types'

export function TextH6({ internalSx, ...props }: TextInternalProps) {
  return <BaseTypography variant="h6" internalSx={internalSx} {...props} />
}
