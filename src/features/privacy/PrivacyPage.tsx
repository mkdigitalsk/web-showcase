import { Box, Container, Stack } from '@mui/material'
import { useTranslation } from '../../shared/hooks'
import { TextBody1Neutral60, TextCaptionNeutral60, TextH4Bold, TextH6Bold } from '../../shared/components'

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

export function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <TextH4Bold sx={{ mb: 1 }}>{t('privacy.title')}</TextH4Bold>
      <Box sx={{ mb: 4 }}>
        <TextCaptionNeutral60>{t('privacy.updated')}</TextCaptionNeutral60>
      </Box>

      <Stack spacing={3}>
        {SECTIONS.map((section) => (
          <Box key={section}>
            <TextH6Bold sx={{ mb: 1 }}>{t(`privacy.${section}.h`)}</TextH6Bold>
            {t(`privacy.${section}.body`)
              .split('\n\n')
              .map((paragraph, i) => (
                <TextBody1Neutral60 key={paragraph.slice(0, 40)} sx={{ mt: i === 0 ? 0 : 2 }}>
                  {paragraph}
                </TextBody1Neutral60>
              ))}
          </Box>
        ))}
      </Stack>
    </Container>
  )
}
