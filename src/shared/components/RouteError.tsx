import { Stack } from '@mui/material'
import type { FallbackProps } from 'react-error-boundary'
import { useTranslation } from '../hooks'
import { Button } from './Button'
import { TextBody1Neutral60, TextH4Bold } from './text'

/**
 * What a route renders once it has crashed. `error` is deliberately unread — its message is the thrown
 * value's own text, which carries whatever detail the failure happened to hold.
 */
export function RouteError({ resetErrorBoundary }: FallbackProps) {
  const { t } = useTranslation()

  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start', p: 3 }}>
      <TextH4Bold>{t('errors.routeTitle')}</TextH4Bold>
      <TextBody1Neutral60>{t('errors.routeBody')}</TextBody1Neutral60>
      <Button onClick={resetErrorBoundary}>{t('common.retry')}</Button>
    </Stack>
  )
}
