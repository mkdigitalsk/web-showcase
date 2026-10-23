import type { ReactNode } from 'react'
import { DividerPrimary, Text } from '../../../shared/components'
import styles from './Section.module.css'

/** One family of components — its heading, then its examples. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <Text variant="h6" bold as="h2">
          {title}
        </Text>
        <DividerPrimary />
      </div>
      {children}
    </section>
  )
}
