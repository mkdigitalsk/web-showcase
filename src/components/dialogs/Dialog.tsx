import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'

type AlertDialogProps = {
  open: boolean
  title?: string
  text: string
  confirmText?: string
  dismissText?: string
  onConfirm: () => void
  onDismiss: () => void
}

export function AlertDialog({
  open,
  title,
  text,
  confirmText = 'OK',
  dismissText = 'Cancel',
  onConfirm,
  onDismiss,
}: AlertDialogProps) {
  return (
    <MuiDialog open={open} onClose={onDismiss}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss}>{dismissText}</Button>
        <Button onClick={onConfirm} autoFocus>{confirmText}</Button>
      </DialogActions>
    </MuiDialog>
  )
}

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
        <Button onClick={onConfirm} autoFocus>{confirmText}</Button>
      </DialogActions>
    </MuiDialog>
  )
}
