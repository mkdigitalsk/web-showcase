import { BaseTypography } from './BaseTypography'
import { type TextInternalProps } from './types'

export function TextH1({ internalSx, ...props }: TextInternalProps) {
  return <BaseTypography variant="h1" internalSx={internalSx} {...props} />
}
