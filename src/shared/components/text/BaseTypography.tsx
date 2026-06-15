import { Typography, type SxProps, type TypographyProps } from '@mui/material'
import { type BaseTextProps } from './types'

interface BaseTypographyProps extends BaseTextProps {
  variant: TypographyProps['variant']
  internalSx?: SxProps
}

export function BaseTypography({ variant, internalSx, sx, ...props }: BaseTypographyProps) {
  return <Typography variant={variant} sx={{ ...internalSx, ...sx } as SxProps} {...props} />
}
