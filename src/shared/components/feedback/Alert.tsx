import { Alert as MuiAlert, type AlertProps as MuiAlertProps } from '@mui/material'

type AlertBaseProps = Omit<MuiAlertProps, 'severity'>

// Base Alert - use severity variants in pages
export function Alert({ sx, ...props }: MuiAlertProps) {
  return <MuiAlert sx={sx} {...props} />
}

export function AlertError({ sx, ...props }: AlertBaseProps) {
  return <Alert severity="error" sx={sx} {...props} />
}

export function AlertSuccess({ sx, ...props }: AlertBaseProps) {
  return <Alert severity="success" sx={sx} {...props} />
}

export function AlertWarning({ sx, ...props }: AlertBaseProps) {
  return <Alert severity="warning" sx={sx} {...props} />
}

export function AlertInfo({ sx, ...props }: AlertBaseProps) {
  return <Alert severity="info" sx={sx} {...props} />
}
