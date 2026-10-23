import type { ReactNode } from 'react'
import { Card, TextBody1Neutral60, TextH6Bold } from '../../../shared/components'
import styles from './CapabilityCard.module.css'

export function CapabilityCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <Card className={styles.card}>
      <TextH6Bold>{title}</TextH6Bold>
      <TextBody1Neutral60 className={styles.subtitle}>{subtitle}</TextBody1Neutral60>
      {children}
    </Card>
  )
}
