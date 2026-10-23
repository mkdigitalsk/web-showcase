import { EnterFullscreenIcon, ExitFullscreenIcon } from '../../../shared/components/icons/catalog'
import { AlertError, AlertInfo, Button } from '../../../shared/components'
import { useFullscreen, useTranslation, type FullscreenOutcome } from '../../../shared/hooks'
import { useOutcome } from '../useOutcome'
import { CapabilityCard } from './CapabilityCard'
import { Stack } from './Stack'

export function FullscreenCard() {
  const { t } = useTranslation()
  const { isSupported, isFullscreen, toggle } = useFullscreen()
  const { outcome, run } = useOutcome<FullscreenOutcome>()

  return (
    <CapabilityCard title={t('capabilities.fullscreen.title')} subtitle={t('capabilities.fullscreen.subtitle')}>
      {isSupported ? (
        <Stack>
          <div>
            <Button
              variant="outline"
              startIcon={isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
              onClick={() => void run(toggle)}
            >
              {isFullscreen ? t('capabilities.fullscreen.exit') : t('capabilities.fullscreen.enter')}
            </Button>
          </div>
          {outcome === 'refused' && <AlertError>{t('capabilities.fullscreen.refused')}</AlertError>}
        </Stack>
      ) : (
        <AlertInfo>{t('capabilities.fullscreen.notSupported')}</AlertInfo>
      )}
    </CapabilityCard>
  )
}
