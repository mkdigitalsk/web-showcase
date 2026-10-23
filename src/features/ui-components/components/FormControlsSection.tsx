import { useState } from 'react'
import { Checkbox, RadioButton, RadioGroup, Slider, Switch, TextBody1Neutral60 } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { Section } from './Section'
import styles from './FormControlsSection.module.css'

const RADIO_OPTIONS = ['a', 'b', 'c'] as const
type RadioOption = (typeof RADIO_OPTIONS)[number]
const isRadioOption = (value: unknown): value is RadioOption => RADIO_OPTIONS.includes(value as RadioOption)

export function FormControlsSection() {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [radio, setRadio] = useState<RadioOption>('a')
  const [slider, setSlider] = useState(40)

  return (
    <Section title={t('uiComponents.forms')}>
      <div className={styles.controls}>
        <Checkbox label={t('uiComponents.forms.checkbox')} checked={checked} onCheckedChange={setChecked} />
        <Switch label={t('uiComponents.forms.switch')} checked={switchOn} onCheckedChange={setSwitchOn} />
        <RadioGroup
          row
          aria-label={t('uiComponents.forms.radio')}
          value={radio}
          onValueChange={(value) => {
            if (isRadioOption(value)) setRadio(value)
          }}
        >
          {RADIO_OPTIONS.map((option) => (
            <RadioButton key={option} value={option} label={t(`uiComponents.forms.radio${option.toUpperCase()}`)} />
          ))}
        </RadioGroup>
        <div className={styles.slider}>
          <TextBody1Neutral60>
            {t('uiComponents.forms.slider')}: {slider}
          </TextBody1Neutral60>
          <Slider
            label={t('uiComponents.forms.slider')}
            value={slider}
            onValueChange={(value) => setSlider(typeof value === 'number' ? value : (value[0] ?? 0))}
          />
        </div>
      </div>
    </Section>
  )
}
