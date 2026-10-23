import { TextBody1Neutral60, TextBody1Neutral80 } from '../../../shared/components'
import styles from './InfoRow.module.css'

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <TextBody1Neutral60>{label}:</TextBody1Neutral60>
      <TextBody1Neutral80>{value}</TextBody1Neutral80>
    </div>
  )
}
