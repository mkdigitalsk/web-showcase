import { useTranslation } from '../../hooks'
import { Logo } from '../icons/Logo'
import { AccountMenu } from './AccountMenu'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeModeToggle } from './ThemeModeToggle'
import styles from './TopBar.module.css'

/** The name beside the logo says which app of the suite this is; the logo carries the brand. */
export function TopBar() {
  const { t } = useTranslation()

  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <Logo variant="lockup" />
        <span className={styles.product}>{t('app.name')}</span>
      </div>
      <div className={styles.actions}>
        <LocaleSwitcher />
        <ThemeModeToggle />
        <AccountMenu />
      </div>
    </header>
  )
}
