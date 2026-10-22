import { useTranslation } from '../../shared/hooks'
import { Locale } from '../../shared/enums/locale'
import { TextBody1Neutral60, TextCaptionNeutral60, TextH4Bold, TextH6Bold } from '../../shared/components'
import styles from './PrivacyPage.module.css'

const SECTIONS = [
  'controller',
  'data',
  'purpose',
  'obligation',
  'recipients',
  'transfers',
  'retention',
  'rights',
  'complaint',
  'automated',
  'changes',
] as const

export default function PrivacyPage() {
  const { t, intl } = useTranslation()

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <TextH4Bold>{t('privacy.title')}</TextH4Bold>
        <TextCaptionNeutral60>{t('privacy.updated')}</TextCaptionNeutral60>
      </div>

      <div className={styles.sections}>
        {SECTIONS.map((section) => (
          <section key={section} className={styles.section}>
            <TextH6Bold>{t(`privacy.${section}.h`)}</TextH6Bold>
            {t(`privacy.${section}.body`)
              .split('\n\n')
              .map((paragraph) => (
                <TextBody1Neutral60 key={paragraph.slice(0, 40)}>{paragraph}</TextBody1Neutral60>
              ))}
          </section>
        ))}
        {intl.locale !== Locale.SK_SK && <TextCaptionNeutral60>{t('privacy.prevailing')}</TextCaptionNeutral60>}
      </div>
    </div>
  )
}
