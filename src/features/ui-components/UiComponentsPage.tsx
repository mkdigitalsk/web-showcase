import { Mail, Notifications } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { type ReactNode, useState } from 'react'
import {
  AlertDialog,
  AlertError,
  AlertInfo,
  AlertSuccess,
  AlertWarning,
  Badge,
  BadgedBox,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  ConfirmDialog,
  Divider,
  DividerPrimary,
  DotBadgedBox,
  ElevatedCard,
  FilterChip,
  Input,
  LinearProgress,
  LoadingView,
  RadioButton,
  Slider,
  Snackbar,
  Switch,
  TextBody1,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextBody1Primary,
  TextH4Bold,
  TextH4BoldNeutral80,
  TextH4BoldPrimary,
  TextH6Bold,
  TextH6BoldNeutral80,
  TextH6BoldPrimary,
} from '../../shared/components'
import { useTranslation } from '../../shared/hooks'

function Section({ titleKey, children }: { titleKey: string; children: ReactNode }) {
  const { t } = useTranslation()
  return (
    <Box>
      <TextH6Bold sx={{ mb: 1 }}>{t(titleKey)}</TextH6Bold>
      <DividerPrimary sx={{ mb: 2 }} />
      {children}
    </Box>
  )
}

export function UiComponentsPage() {
  const { t } = useTranslation()

  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [switchOn, setSwitchOn] = useState(false)
  const [radio, setRadio] = useState('a')
  const [slider, setSlider] = useState(40)
  const [filterSelected, setFilterSelected] = useState(false)

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={4}>

        <Section titleKey="uiComponents.typography">
          <Stack spacing={1}>
            <TextH4Bold>{t('uiComponents.typography.h4Bold')}</TextH4Bold>
            <TextH4BoldPrimary>{t('uiComponents.typography.h4BoldPrimary')}</TextH4BoldPrimary>
            <TextH4BoldNeutral80>{t('uiComponents.typography.h4BoldNeutral80')}</TextH4BoldNeutral80>
            <TextH6Bold>{t('uiComponents.typography.h6Bold')}</TextH6Bold>
            <TextH6BoldPrimary>{t('uiComponents.typography.h6BoldPrimary')}</TextH6BoldPrimary>
            <TextH6BoldNeutral80>{t('uiComponents.typography.h6BoldNeutral80')}</TextH6BoldNeutral80>
            <TextBody1>{t('uiComponents.typography.body1')}</TextBody1>
            <TextBody1Neutral80>{t('uiComponents.typography.body1Neutral80')}</TextBody1Neutral80>
            <TextBody1Neutral60>{t('uiComponents.typography.body1Neutral60')}</TextBody1Neutral60>
            <TextBody1Primary>{t('uiComponents.typography.body1Primary')}</TextBody1Primary>
          </Stack>
        </Section>

        <Section titleKey="uiComponents.buttons">
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
            <Button>{t('uiComponents.buttons.primary')}</Button>
            <Button variant="secondary">{t('uiComponents.buttons.secondary')}</Button>
            <Button variant="outline">{t('uiComponents.buttons.outline')}</Button>
            <Button disabled>{t('uiComponents.buttons.disabled')}</Button>
            <Button loading>{t('uiComponents.buttons.loading')}</Button>
          </Stack>
        </Section>

        <Section titleKey="uiComponents.input">
          <Stack spacing={2}>
            <Input label={t('uiComponents.input.default')} placeholder={t('uiComponents.input.placeholder')} />
            <Input label={t('uiComponents.input.error')} error helperText={t('uiComponents.input.errorText')} />
            <Input label={t('uiComponents.input.disabled')} disabled />
          </Stack>
        </Section>

        <Section titleKey="uiComponents.cards">
          <Stack spacing={2}>
            <Card sx={{ p: 2 }}>
              <TextH6Bold>{t('uiComponents.cards.outlined')}</TextH6Bold>
              <TextBody1Neutral60>{t('uiComponents.cards.outlinedDesc')}</TextBody1Neutral60>
            </Card>
            <ElevatedCard sx={{ p: 2 }}>
              <TextH6Bold>{t('uiComponents.cards.elevated')}</TextH6Bold>
              <TextBody1Neutral60>{t('uiComponents.cards.elevatedDesc')}</TextBody1Neutral60>
            </ElevatedCard>
          </Stack>
        </Section>

        <Section titleKey="uiComponents.chips">
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip label={t('uiComponents.chips.default')} />
            <Chip label={t('uiComponents.chips.outlined')} variant="outlined" />
            <Chip label={t('uiComponents.chips.deletable')} onDelete={() => {}} />
            <FilterChip
              label={t('uiComponents.chips.filter')}
              selected={filterSelected}
              onClick={() => setFilterSelected((v) => !v)}
            />
          </Stack>
        </Section>

        <Section titleKey="uiComponents.alerts">
          <Stack spacing={1}>
            <AlertSuccess>{t('uiComponents.alerts.success')}</AlertSuccess>
            <AlertError>{t('uiComponents.alerts.error')}</AlertError>
            <AlertWarning>{t('uiComponents.alerts.warning')}</AlertWarning>
            <AlertInfo>{t('uiComponents.alerts.info')}</AlertInfo>
          </Stack>
        </Section>

        <Section titleKey="uiComponents.progress">
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CircularProgress size={32} />
              <TextBody1Neutral60>{t('uiComponents.progress.circular')}</TextBody1Neutral60>
            </Box>
            <Box>
              <TextBody1Neutral60 sx={{ mb: 1 }}>{t('uiComponents.progress.linear')}</TextBody1Neutral60>
              <LinearProgress value={60} variant="determinate" />
            </Box>
            <Box>
              <TextBody1Neutral60 sx={{ mb: 1 }}>{t('uiComponents.progress.loadingView')}</TextBody1Neutral60>
              <Box sx={{ height: 80, position: 'relative', border: '1px dashed', borderColor: 'divider' }}>
                <LoadingView />
              </Box>
            </Box>
          </Stack>
        </Section>

        <Section titleKey="uiComponents.badges">
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Badge badgeContent={4}>
              <Mail />
            </Badge>
            <BadgedBox count={12}>
              <Notifications />
            </BadgedBox>
            <DotBadgedBox showBadge>
              <Notifications />
            </DotBadgedBox>
          </Stack>
        </Section>

        <Section titleKey="uiComponents.forms">
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Checkbox checked={checked} onChange={(_, v) => setChecked(v)} />
              <TextBody1>{t('uiComponents.forms.checkbox')}</TextBody1>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Switch checked={switchOn} onChange={(_, v) => setSwitchOn(v)} />
              <TextBody1>{t('uiComponents.forms.switch')}</TextBody1>
            </Box>
            <Stack direction="row" spacing={2}>
              {['a', 'b', 'c'].map((val) => (
                <Box key={val} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RadioButton checked={radio === val} onChange={() => setRadio(val)} value={val} />
                  <TextBody1>{t(`uiComponents.forms.radio${val.toUpperCase()}`)}</TextBody1>
                </Box>
              ))}
            </Stack>
            <Box>
              <TextBody1Neutral60 sx={{ mb: 1 }}>{t('uiComponents.forms.slider')}: {slider}</TextBody1Neutral60>
              <Slider value={slider} onChange={(_, v) => setSlider(v as number)} />
            </Box>
          </Stack>
        </Section>

        <Section titleKey="uiComponents.dialogs">
          <Stack direction="row" spacing={2}>
            <Button variant="outline" onClick={() => setAlertDialogOpen(true)}>
              {t('uiComponents.dialogs.openAlert')}
            </Button>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(true)}>
              {t('uiComponents.dialogs.openConfirm')}
            </Button>
            <Button variant="outline" onClick={() => setSnackbarOpen(true)}>
              {t('uiComponents.dialogs.openSnackbar')}
            </Button>
          </Stack>
          <AlertDialog
            open={alertDialogOpen}
            title={t('uiComponents.dialogs.alertTitle')}
            text={t('uiComponents.dialogs.alertText')}
            onConfirm={() => setAlertDialogOpen(false)}
            onDismiss={() => setAlertDialogOpen(false)}
          />
          <ConfirmDialog
            open={confirmDialogOpen}
            title={t('uiComponents.dialogs.confirmTitle')}
            text={t('uiComponents.dialogs.confirmText')}
            onConfirm={() => setConfirmDialogOpen(false)}
          />
          <Snackbar
            open={snackbarOpen}
            message={t('uiComponents.dialogs.snackbarMessage')}
            type="success"
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
          />
        </Section>

        <Section titleKey="uiComponents.dividers">
          <Stack spacing={2}>
            <Divider />
            <DividerPrimary />
          </Stack>
        </Section>

      </Stack>
    </Box>
  )
}
