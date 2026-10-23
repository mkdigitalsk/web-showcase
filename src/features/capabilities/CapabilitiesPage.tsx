import { PageContainer, PageHeader } from '../../shared/components'
import { useTranslation } from '../../shared/hooks'
import { BrowserCard } from './components/BrowserCard'
import { ClipboardCard } from './components/ClipboardCard'
import { FullscreenCard } from './components/FullscreenCard'
import { GeolocationCard } from './components/GeolocationCard'
import { NotificationsCard } from './components/NotificationsCard'
import { PrintCard } from './components/PrintCard'
import { ShareCard } from './components/ShareCard'
import { SpeechCard } from './components/SpeechCard'
import { VibrationCard } from './components/VibrationCard'
import styles from './CapabilitiesPage.module.css'

export default function CapabilitiesPage() {
  const { t } = useTranslation()

  return (
    <PageContainer>
      <PageHeader title={t('capabilities.title')} description={t('capabilities.subtitle')} />
      <div className={styles.cards}>
        <BrowserCard />
        <ClipboardCard />
        <GeolocationCard />
        <SpeechCard />
        <ShareCard />
        <FullscreenCard />
        <PrintCard />
        <VibrationCard />
        <NotificationsCard />
      </div>
    </PageContainer>
  )
}
