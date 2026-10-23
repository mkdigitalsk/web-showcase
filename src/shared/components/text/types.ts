import type { ReactNode } from 'react'

/** A text's colour by what it says — the ink, a subline, a disabled line, the action, or a state's meaning. */
export type TextTone = 'ink' | 'muted' | 'faint' | 'action' | 'success' | 'warning' | 'info' | 'error' | 'secondary'

export interface BaseTextProps {
  align?: 'left' | 'center' | 'right'
  gutterBottom?: boolean
  noWrap?: boolean
  className?: string
  id?: string
  children?: ReactNode
}
