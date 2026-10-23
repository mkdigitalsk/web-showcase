import { useBrowserInfo, useTranslation } from '../../../shared/hooks'
import { CapabilityCard } from './CapabilityCard'
import { InfoRow } from './InfoRow'
import styles from './BrowserCard.module.css'

export function BrowserCard() {
  const { t } = useTranslation()
  const { browser, platform, language, online, cookiesEnabled } = useBrowserInfo()

  return (
    <CapabilityCard title={t('capabilities.browser.title')} subtitle={t('capabilities.browser.subtitle')}>
      <div className={styles.info}>
        <InfoRow label={t('capabilities.browser.name')} value={browser ?? t('capabilities.browser.unknown')} />
        <InfoRow label={t('capabilities.browser.platform')} value={platform} />
        <InfoRow label={t('capabilities.browser.language')} value={language} />
        <InfoRow
          label={t('capabilities.browser.online')}
          value={online ? t('capabilities.browser.yes') : t('capabilities.browser.no')}
        />
        <InfoRow
          label={t('capabilities.browser.cookiesEnabled')}
          value={cookiesEnabled ? t('capabilities.browser.enabled') : t('capabilities.browser.disabled')}
        />
      </div>
    </CapabilityCard>
  )
}
