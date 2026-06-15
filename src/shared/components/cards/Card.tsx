import { Card as MuiCard, type CardProps as MuiCardProps } from '@mui/material'

type CardProps = MuiCardProps

export function Card({ sx, ...props }: CardProps) {
  return <MuiCard variant="outlined" sx={sx} {...props} />
}

export function ElevatedCard({ onClick, sx, ...props }: CardProps) {
  const isClickable = Boolean(onClick)

  return (
    <MuiCard
      elevation={2}
      onClick={onClick}
      sx={{
        ...(isClickable && {
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            elevation: 4,
            bgcolor: 'action.hover',
          },
          '&:active': {
            bgcolor: 'action.selected',
          },
        }),
        ...sx,
      }}
      {...props}
    />
  )
}
