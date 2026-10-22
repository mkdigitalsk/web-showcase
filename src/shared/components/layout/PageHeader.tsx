import { TextBody1Neutral60 } from '../text'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  description: string
}

/**
 * The nav already names the screen and marks which one is open, so drawing the name again is noise.
 * It stays in the tree as the page's one h1 because the nav is a set of links, not a heading, and a
 * page with no heading leaves a screen reader nothing to announce it by.
 */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <TextBody1Neutral60>{description}</TextBody1Neutral60>
    </div>
  )
}
