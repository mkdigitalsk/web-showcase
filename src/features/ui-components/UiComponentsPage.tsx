import { EmailIcon, NotificationsIcon } from '../../shared/components/icons/catalog'
import {
  AlertError,
  AlertInfo,
  AlertSuccess,
  AlertWarning,
  Badge,
  BadgedBox,
  Button,
  Card,
  CircularProgress,
  Divider,
  DividerPrimary,
  DotBadgedBox,
  Icon,
  Input,
  LinearProgress,
  LoadingView,
  PageContainer,
  PageHeader,
  Text,
  TextBody1,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextBody1Primary,
} from '../../shared/components'
import { useTranslation } from '../../shared/hooks'
import { ChipsSection } from './components/ChipsSection'
import { DialogsSection } from './components/DialogsSection'
import { FormControlsSection } from './components/FormControlsSection'
import { Section } from './components/Section'
import styles from './UiComponentsPage.module.css'

export default function UiComponentsPage() {
  const { t } = useTranslation()

  return (
    <PageContainer maxWidth={1200}>
      <PageHeader title={t('uiComponents.title')} description={t('uiComponents.subtitle')} />
      <div className={styles.sections}>
        <Section title={t('uiComponents.typography')}>
          <div className={styles.lines}>
            <Text variant="h4" bold as="p">
              {t('uiComponents.typography.h4Bold')}
            </Text>
            <Text variant="h4" bold tone="action" as="p">
              {t('uiComponents.typography.h4BoldPrimary')}
            </Text>
            <Text variant="h4" bold tone="ink" as="p">
              {t('uiComponents.typography.h4BoldNeutral80')}
            </Text>
            <Text variant="h6" bold as="p">
              {t('uiComponents.typography.h6Bold')}
            </Text>
            <Text variant="h6" bold tone="action" as="p">
              {t('uiComponents.typography.h6BoldPrimary')}
            </Text>
            <Text variant="h6" bold tone="ink" as="p">
              {t('uiComponents.typography.h6BoldNeutral80')}
            </Text>
            <TextBody1>{t('uiComponents.typography.body1')}</TextBody1>
            <TextBody1Neutral80>{t('uiComponents.typography.body1Neutral80')}</TextBody1Neutral80>
            <TextBody1Neutral60>{t('uiComponents.typography.body1Neutral60')}</TextBody1Neutral60>
            <TextBody1Primary>{t('uiComponents.typography.body1Primary')}</TextBody1Primary>
          </div>
        </Section>

        <Section title={t('uiComponents.buttons')}>
          <div className={styles.row}>
            <Button>{t('uiComponents.buttons.primary')}</Button>
            <Button variant="secondary">{t('uiComponents.buttons.secondary')}</Button>
            <Button variant="outline">{t('uiComponents.buttons.outline')}</Button>
            <Button disabled>{t('uiComponents.buttons.disabled')}</Button>
            <Button loading>{t('uiComponents.buttons.loading')}</Button>
          </div>
        </Section>

        <Section title={t('uiComponents.input')}>
          <div className={styles.fields}>
            <Input label={t('uiComponents.input.default')} placeholder={t('uiComponents.input.placeholder')} />
            <Input label={t('uiComponents.input.error')} errorText={t('uiComponents.input.errorText')} />
            <Input label={t('uiComponents.input.disabled')} disabled />
          </div>
        </Section>

        <Section title={t('uiComponents.cards')}>
          <Card className={styles.card}>
            <Text variant="h6" bold as="h3">
              {t('uiComponents.cards.outlined')}
            </Text>
            <TextBody1Neutral60>{t('uiComponents.cards.outlinedDesc')}</TextBody1Neutral60>
          </Card>
        </Section>

        <ChipsSection />

        <Section title={t('uiComponents.alerts')}>
          <div className={styles.lines}>
            <AlertSuccess>{t('uiComponents.alerts.success')}</AlertSuccess>
            <AlertError>{t('uiComponents.alerts.error')}</AlertError>
            <AlertWarning>{t('uiComponents.alerts.warning')}</AlertWarning>
            <AlertInfo>{t('uiComponents.alerts.info')}</AlertInfo>
          </div>
        </Section>

        <Section title={t('uiComponents.progress')}>
          <div className={styles.column}>
            <div className={styles.row}>
              <CircularProgress size={32} />
              <TextBody1Neutral60>{t('uiComponents.progress.circular')}</TextBody1Neutral60>
            </div>
            <div className={styles.lines}>
              <TextBody1Neutral60>{t('uiComponents.progress.linear')}</TextBody1Neutral60>
              <LinearProgress value={60} />
            </div>
            <div className={styles.lines}>
              <TextBody1Neutral60>{t('uiComponents.progress.loadingView')}</TextBody1Neutral60>
              <div className={styles.loadingBox}>
                <LoadingView />
              </div>
            </div>
          </div>
        </Section>

        <Section title={t('uiComponents.badges')}>
          <div className={styles.badges}>
            <Badge content={4}>
              <Icon glyph={EmailIcon} size="large" />
            </Badge>
            <BadgedBox count={12}>
              <Icon glyph={NotificationsIcon} size="large" />
            </BadgedBox>
            <DotBadgedBox showBadge>
              <Icon glyph={NotificationsIcon} size="large" />
            </DotBadgedBox>
          </div>
        </Section>

        <FormControlsSection />

        <DialogsSection />

        <Section title={t('uiComponents.dividers')}>
          <div className={styles.column}>
            <Divider />
            <DividerPrimary />
          </div>
        </Section>
      </div>
    </PageContainer>
  )
}
