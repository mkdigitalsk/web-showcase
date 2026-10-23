import type { ReactNode } from 'react'
import styles from './CentredColumn.module.css'

export function CentredColumn({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.column}>{children}</div>
    </div>
  )
}
