import type { ReactNode } from 'react'
import { cx, cssVars } from '../css'
import styles from './PageContainer.module.css'

interface PageContainerProps {
  children: ReactNode
  /** The content's cap, in px — forms, cards and lists stay readable rather than stretching across the panel. */
  maxWidth?: number
  className?: string
}

export function PageContainer({ children, maxWidth = 960, className }: PageContainerProps) {
  return (
    <div className={cx(styles.page, className)} style={cssVars({ '--page-max': `${maxWidth}px` })}>
      {children}
    </div>
  )
}
