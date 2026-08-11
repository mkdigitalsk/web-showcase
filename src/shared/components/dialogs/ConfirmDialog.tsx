import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  text: string
  confirmText?: string
  onConfirm: () => void
}

export function ConfirmDialog({ open, title, text, confirmText = 'OK', onConfirm }: ConfirmDialogProps) {
  return (
    <MuiDialog open={open} onClose={onConfirm}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <Button onClick={onConfirm} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </MuiDialog>
  )
}
