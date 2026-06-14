import { type ComponentProps } from 'react'
import { Typography, type TypographyProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

type TextBody1Props = Omit<TypographyProps, 'variant'>

// Base Body1 component - use color variants (TextBody1Neutral60) in pages
export function TextBody1({ sx, ...props }: TextBody1Props) {
  return <Typography variant="body1" sx={sx} {...props} />
}

export function TextBody1Neutral80({ sx, ...props }: ComponentProps<typeof TextBody1>) {
  const theme = useTheme()
  return <TextBody1 sx={{ color: theme.palette.neutral[80], ...sx }} {...props} />
}

export function TextBody1Neutral60({ sx, ...props }: ComponentProps<typeof TextBody1>) {
  const theme = useTheme()
  return <TextBody1 sx={{ color: theme.palette.neutral[60], ...sx }} {...props} />
}

export function TextBody1Primary({ sx, ...props }: ComponentProps<typeof TextBody1>) {
  const theme = useTheme()
  return <TextBody1 sx={{ color: theme.palette.primary.main, ...sx }} {...props} />
}
