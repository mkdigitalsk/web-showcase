import { Card as MuiCard, type CardProps as MuiCardProps } from '@mui/material'

type CardProps = MuiCardProps

export function Card({ sx, ...props }: CardProps) {
  return <MuiCard variant="outlined" sx={sx} {...props} />
}

export function ElevatedCard({ sx, ...props }: CardProps) {
  return <MuiCard elevation={2} sx={sx} {...props} />
}
