import { useTranslation } from '../../shared/hooks'
import { Locale } from '../../shared/enums/locale'
import { TextBody1Neutral60, TextCaptionNeutral60, TextH4Bold, TextH6Bold } from '../../shared/components'
import styles from './LegalTextPage.module.css'

/** The locale key a legal text's title, `updated` line and sections sit under. */
export type LegalText = 'privacy' | 'terms'

interface LegalTextPageProps {
  text: LegalText
  /** The sections' keys, in the order the text prints them. */
  sections: readonly string[]
}

/**
 * A legal text as the locale file holds it — its title, since when it applies, then a heading and paragraphs per
 * section. Slovak is the original, so every other locale ends with the line saying it reads a translation.
 */
export function LegalTextPage({ text, sections }: LegalTextPageProps) {
  const { t, intl } = useTranslation()

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <TextH4Bold>{t(`${text}.title`)}</TextH4Bold>
        <TextCaptionNeutral60>{t(`${text}.updated`)}</TextCaptionNeutral60>
      </div>

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section} className={styles.section}>
            <TextH6Bold>{t(`${text}.${section}.h`)}</TextH6Bold>
            {t(`${text}.${section}.body`)
              .split('\n\n')
              .map((paragraph) => (
                <TextBody1Neutral60 key={paragraph.slice(0, 40)}>{paragraph}</TextBody1Neutral60>
              ))}
          </section>
        ))}
        {intl.locale !== Locale.SK_SK && <TextCaptionNeutral60>{t('legal.prevailing')}</TextCaptionNeutral60>}
      </div>
    </div>
  )
}
