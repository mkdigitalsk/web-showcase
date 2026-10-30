import { useConsent, useTranslation } from '../../hooks'
import styles from './MeasurementSettingsButton.module.css'

/** Opens the consent dialog, drawn as a link. */
export function MeasurementSettingsButton() {
  const { t } = useTranslation()
  const { choose, reopener } = useConsent()

  return (
    <button ref={reopener} type="button" className={styles.button} onClick={choose}>
      {t('consent.change')}
    </button>
  )
}
