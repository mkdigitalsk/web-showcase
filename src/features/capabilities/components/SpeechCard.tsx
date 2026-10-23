import { useState } from 'react'
import { SpeakIcon } from '../../../shared/components/icons/catalog'
import { AlertInfo, Button, TextArea } from '../../../shared/components'
import { useSpeech, useTranslation } from '../../../shared/hooks'
import { CapabilityCard } from './CapabilityCard'
import { Stack } from './Stack'

export function SpeechCard() {
  const { t } = useTranslation()
  const { isSupported, isSpeaking, toggle } = useSpeech()
  const [text, setText] = useState(t('capabilities.speech.defaultText'))

  return (
    <CapabilityCard title={t('capabilities.speech.title')} subtitle={t('capabilities.speech.subtitle')}>
      <Stack>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
          minRows={2}
          placeholder={t('capabilities.speech.placeholder')}
        />
        <div>
          {isSupported ? (
            <Button variant="outline" startIcon={<SpeakIcon />} onClick={() => toggle(text)}>
              {isSpeaking ? t('capabilities.speech.stop') : t('capabilities.speech.speak')}
            </Button>
          ) : (
            <AlertInfo>{t('capabilities.speech.notSupported')}</AlertInfo>
          )}
        </div>
      </Stack>
    </CapabilityCard>
  )
}
