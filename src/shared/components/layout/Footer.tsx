import { useTranslation } from '../../hooks'
import { Routes } from '../../../utils'
import { IconLink } from '../IconLink'
import { GitHubIcon } from '../icons/GitHubIcon'
import { Logo } from '../icons/Logo'
import { TextCaption, TextLink } from '../text'
import { MeasurementSettingsButton } from './MeasurementSettingsButton'
import styles from './Footer.module.css'

const GITHUB = 'https://github.com/mkdigitalsk'

/** Company and version stay in view — the version is the reference a bug report quotes. */
export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className={styles.footer}>
      <Logo variant="lockup" />
      <div className={styles.meta}>
        <TextCaption>© 2026 MK Digital s. r. o.</TextCaption>
        <TextCaption>{t('app.version', { version: __APP_VERSION__ })}</TextCaption>
        <TextLink to={Routes.PRIVACY}>{t('privacy.link')}</TextLink>
        <TextLink to={Routes.TERMS}>{t('terms.link')}</TextLink>
        <MeasurementSettingsButton />
        <IconLink href={GITHUB} aria-label="GitHub" size="small">
          <GitHubIcon />
        </IconLink>
      </div>
    </footer>
  )
}
