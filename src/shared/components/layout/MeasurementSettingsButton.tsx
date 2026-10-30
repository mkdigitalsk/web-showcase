import { useConsent, useTranslation } from '../../hooks'
import styles from './MeasurementSettingsButton.module.css'

/** The footer's one button — it opens the consent dialog, drawn as the links beside it are. */
export function MeasurementSettingsButton() {
  const { t } = useTranslation()
  const { choose, reopener } = useConsent()

  return (
    <button ref={reopener} type="button" className={styles.button} onClick={choose}>
      {t('consent.change')}
    </button>
  )
}
