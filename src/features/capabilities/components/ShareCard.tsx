import { ShareIcon } from '../../../shared/components/icons/catalog'
import { AlertError, AlertInfo, Button } from '../../../shared/components'
import { useShare, useTranslation, type ShareOutcome } from '../../../shared/hooks'
import { useOutcome } from '../useOutcome'
import { CapabilityCard } from './CapabilityCard'
import { Stack } from './Stack'

export function ShareCard() {
  const { t } = useTranslation()
  const { isSupported, sharePage } = useShare()
  const { outcome, pending, run } = useOutcome<ShareOutcome>()

  return (
    <CapabilityCard title={t('capabilities.share.title')} subtitle={t('capabilities.share.subtitle')}>
      {isSupported ? (
        <Stack>
          <div>
            <Button
              variant="outline"
              startIcon={<ShareIcon />}
              loading={pending}
              onClick={() => void run(() => sharePage(t('app.name'), t('capabilities.share.text')))}
            >
              {t('capabilities.share.button')}
            </Button>
          </div>
          {outcome === 'failed' && <AlertError>{t('capabilities.share.failed')}</AlertError>}
        </Stack>
      ) : (
        <AlertInfo>{t('capabilities.share.notSupported')}</AlertInfo>
      )}
    </CapabilityCard>
  )
}
