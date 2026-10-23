import { VibrateIcon } from '../../../shared/components/icons/catalog'
import { AlertInfo, Button } from '../../../shared/components'
import { useTranslation, useVibration } from '../../../shared/hooks'
import { CapabilityCard } from './CapabilityCard'

/** Buzz, pause, buzz, in milliseconds — a pattern a person tells from a single notification buzz. */
const DOUBLE_BUZZ = [100, 50, 100]

export function VibrationCard() {
  const { t } = useTranslation()
  const { isSupported, vibrate } = useVibration()

  return (
    <CapabilityCard title={t('capabilities.vibration.title')} subtitle={t('capabilities.vibration.subtitle')}>
      {isSupported ? (
        <Button variant="outline" startIcon={<VibrateIcon />} onClick={() => vibrate(DOUBLE_BUZZ)}>
          {t('capabilities.vibration.button')}
        </Button>
      ) : (
        <AlertInfo>{t('capabilities.vibration.notSupported')}</AlertInfo>
      )}
    </CapabilityCard>
  )
}
