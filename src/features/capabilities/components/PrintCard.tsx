import { PrintIcon } from '../../../shared/components/icons/catalog'
import { Button } from '../../../shared/components'
import { usePrint, useTranslation } from '../../../shared/hooks'
import { CapabilityCard } from './CapabilityCard'

export function PrintCard() {
  const { t } = useTranslation()
  const print = usePrint()

  return (
    <CapabilityCard title={t('capabilities.print.title')} subtitle={t('capabilities.print.subtitle')}>
      <Button variant="outline" startIcon={<PrintIcon />} onClick={print}>
        {t('capabilities.print.button')}
      </Button>
    </CapabilityCard>
  )
}
