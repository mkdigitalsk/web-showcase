import { Typography, type SxProps, type TypographyProps } from '@mui/material'
import { type TextInternalProps } from './types'

interface BaseTypographyProps extends TextInternalProps {
  variant: TypographyProps['variant']
}

export function BaseTypography({ variant, internalSx, sx, ...props }: BaseTypographyProps) {
  return <Typography variant={variant} sx={{ ...internalSx, ...sx } as SxProps} {...props} />
}
