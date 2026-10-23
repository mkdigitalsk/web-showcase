import { useState } from 'react'
import { CopyIcon, PasteIcon } from '../../../shared/components/icons/catalog'
import { AlertError, AlertSuccess, Button, Input } from '../../../shared/components'
import { useClipboard, useTranslation, type ClipboardOutcome } from '../../../shared/hooks'
import { useOutcome } from '../useOutcome'
import { CapabilityCard } from './CapabilityCard'
import { Stack } from './Stack'
import styles from './ClipboardCard.module.css'

export function ClipboardCard() {
  const { t } = useTranslation()
  const { copy, paste } = useClipboard()
  const [text, setText] = useState(t('capabilities.clipboard.defaultText'))
  const { outcome, run } = useOutcome<ClipboardOutcome>()

  return (
    <CapabilityCard title={t('capabilities.clipboard.title')} subtitle={t('capabilities.clipboard.subtitle')}>
      <Stack>
        <Input value={text} onChange={(e) => setText(e.target.value)} size="small" />
        <div className={styles.row}>
          <Button variant="outline" startIcon={<CopyIcon />} onClick={() => void run(() => copy(text))}>
            {t('capabilities.clipboard.copy')}
          </Button>
          <Button variant="outline" startIcon={<PasteIcon />} onClick={() => void run(paste)}>
            {t('capabilities.clipboard.paste')}
          </Button>
        </div>
        {outcome?.kind === 'copied' && <AlertSuccess>{t('capabilities.clipboard.copied')}</AlertSuccess>}
        {outcome?.kind === 'pasted' && (
          <AlertSuccess>{t('capabilities.clipboard.pasted', { text: outcome.text })}</AlertSuccess>
        )}
        {outcome?.kind === 'refused' && <AlertError>{t('capabilities.clipboard.refused')}</AlertError>}
        {outcome?.kind === 'unsupported' && <AlertError>{t('capabilities.clipboard.notSupported')}</AlertError>}
      </Stack>
    </CapabilityCard>
  )
}
