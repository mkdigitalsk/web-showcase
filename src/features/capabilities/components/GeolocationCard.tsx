import { LocationIcon } from '../../../shared/components/icons/catalog'
import { AlertError, AlertSuccess, Button } from '../../../shared/components'
import { useGeolocation, useTranslation, type LocateOutcome } from '../../../shared/hooks'
import { useOutcome } from '../useOutcome'
import { CapabilityCard } from './CapabilityCard'
import { Stack } from './Stack'

/** Five decimal places of a degree is about a metre — finer than a browser's fix. */
const COORDINATE_DIGITS = 5

export function GeolocationCard() {
  const { t } = useTranslation()
  const { locate } = useGeolocation()
  const { outcome, pending, run } = useOutcome<LocateOutcome>()

  return (
    <CapabilityCard title={t('capabilities.geolocation.title')} subtitle={t('capabilities.geolocation.subtitle')}>
      <Stack>
        <div>
          <Button variant="outline" startIcon={<LocationIcon />} onClick={() => void run(locate)} loading={pending}>
            {t('capabilities.geolocation.get')}
          </Button>
        </div>
        {outcome?.kind === 'located' && (
          <AlertSuccess>
            {t('capabilities.geolocation.result', {
              lat: outcome.latitude.toFixed(COORDINATE_DIGITS),
              lng: outcome.longitude.toFixed(COORDINATE_DIGITS),
            })}
          </AlertSuccess>
        )}
        {outcome?.kind === 'denied' && <AlertError>{t('capabilities.geolocation.denied')}</AlertError>}
        {outcome?.kind === 'unavailable' && <AlertError>{t('capabilities.geolocation.unavailable')}</AlertError>}
        {outcome?.kind === 'unsupported' && <AlertError>{t('capabilities.geolocation.notSupported')}</AlertError>}
      </Stack>
    </CapabilityCard>
  )
}
