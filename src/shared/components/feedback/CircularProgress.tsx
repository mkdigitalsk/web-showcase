import { CircularProgress as MuiCircularProgress, type CircularProgressProps as MuiCircularProgressProps } from '@mui/material'

type CircularProgressProps = MuiCircularProgressProps

export function CircularProgress({ sx, ...props }: CircularProgressProps) {
  return <MuiCircularProgress color="primary" sx={sx} {...props} />
}
