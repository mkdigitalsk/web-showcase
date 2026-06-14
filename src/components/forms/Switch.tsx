import { Switch as MuiSwitch, type SwitchProps as MuiSwitchProps } from '@mui/material'

type SwitchProps = MuiSwitchProps

export function Switch({ sx, ...props }: SwitchProps) {
  return <MuiSwitch color="primary" sx={sx} {...props} />
}
