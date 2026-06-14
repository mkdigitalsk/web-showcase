import { Box, type BoxProps } from '@mui/material'
import { CircularProgress } from './CircularProgress'

type LoadingViewProps = Omit<BoxProps, 'display' | 'justifyContent' | 'alignItems'>

export function LoadingView({ sx, ...props }: LoadingViewProps) {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%', ...sx }}
      {...props}
    >
      <CircularProgress />
    </Box>
  )
}
