import { Snackbar as MuiSnackbar, Alert, type SnackbarProps as MuiSnackbarProps } from '@mui/material'

export type SnackbarType = 'default' | 'success' | 'error' | 'warning' | 'info'

type SnackbarProps = Omit<MuiSnackbarProps, 'children'> & {
  message: string
  type?: SnackbarType
  onClose: () => void
}

export function Snackbar({ message, type = 'default', onClose, ...props }: SnackbarProps) {
  if (type === 'default') {
    return <MuiSnackbar message={message} onClose={onClose} {...props} />
  }

  return (
    <MuiSnackbar onClose={onClose} {...props}>
      <Alert onClose={onClose} severity={type} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </MuiSnackbar>
  )
}
