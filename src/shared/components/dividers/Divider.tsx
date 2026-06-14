import { Divider as MuiDivider, type DividerProps as MuiDividerProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

type DividerProps = MuiDividerProps

export function Divider({ sx, ...props }: DividerProps) {
  return <MuiDivider sx={sx} {...props} />
}

export function DividerPrimary({ sx, ...props }: DividerProps) {
  const theme = useTheme()
  return <MuiDivider sx={{ borderColor: theme.palette.primary.main, ...sx }} {...props} />
}
