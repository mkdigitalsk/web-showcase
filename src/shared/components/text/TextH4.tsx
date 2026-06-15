import { Typography, type TypographyProps } from '@mui/material'

type TextH4Props = Omit<TypographyProps, 'variant'>

// Base H4 component - use color variants (TextH4Bold, TextH4BoldPrimary) in pages
export function TextH4({ sx, ...props }: TextH4Props) {
  return (
    <Typography
      variant="h4"
      sx={sx}
      {...props}
    />
  )
}
