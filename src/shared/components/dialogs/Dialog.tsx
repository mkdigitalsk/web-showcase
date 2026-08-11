import { type ReactNode } from 'react'
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

type DialogProps = {
  open: boolean
  title?: string
  onClose: () => void
  actions: ReactNode
  children: ReactNode
}

export function Dialog({ open, title, onClose, actions, children }: DialogProps) {
  return (
    <MuiDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </MuiDialog>
  )
}
