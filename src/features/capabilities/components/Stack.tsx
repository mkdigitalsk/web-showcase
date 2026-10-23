import type { ReactNode } from 'react'
import styles from './Stack.module.css'

export function Stack({ children }: { children: ReactNode }) {
  return <div className={styles.stack}>{children}</div>
}
