import { LinearProgress as MuiLinearProgress, type LinearProgressProps as MuiLinearProgressProps } from '@mui/material'

type LinearProgressProps = MuiLinearProgressProps

export function LinearProgress({ sx, ...props }: LinearProgressProps) {
  return <MuiLinearProgress color="primary" sx={sx} {...props} />
}
