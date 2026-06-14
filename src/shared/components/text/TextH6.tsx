import { Typography, type TypographyProps } from '@mui/material'

type TextH6Props = Omit<TypographyProps, 'variant'>

// Base H6 component - use style variants (TextH6Bold) in pages
export function TextH6({ sx, ...props }: TextH6Props) {
  return <Typography variant="h6" sx={sx} {...props} />
}
