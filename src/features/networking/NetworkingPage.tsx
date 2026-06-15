import { Email, Refresh } from '@mui/icons-material'
import { Box, CircularProgress, IconButton, Stack } from '@mui/material'
import { AlertError, ElevatedCard, LoadingView, TextBody1Neutral60, TextBody1Neutral80, TextH6Bold } from '../../shared/components'
import { useTranslation } from '../../shared/hooks'
import { useGetUsersQuery } from './useGetUsersQuery'

export function NetworkingPage() {
  const { t } = useTranslation()
  const { data: users, isLoading, isError, refetch, isFetching } = useGetUsersQuery()

  const hasUsers = users && users.length > 0
  const showLoading = isLoading && !hasUsers
  const showError = isError && !hasUsers
  const showEmpty = !isLoading && !isError && !hasUsers

  return (
    <Box sx={{ p: 2 }}>
      {showLoading && <LoadingView />}
      {showError && (
        <AlertError sx={{ mt: 2 }} action={
          <IconButton size="small" onClick={() => void refetch()}>{t('common.retry')}</IconButton>
        }>
          {t('common.error')}
        </AlertError>
      )}
      {showEmpty && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <TextBody1Neutral60>{t('networking.empty')}</TextBody1Neutral60>
        </Box>
      )}
      {hasUsers && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <TextH6Bold>{t('networking.title')}</TextH6Bold>
              <TextBody1Neutral60>{t('networking.subtitle')}</TextBody1Neutral60>
            </Box>
            <IconButton onClick={() => void refetch()} disabled={isFetching}>
              {isFetching ? <CircularProgress size={20} /> : <Refresh />}
            </IconButton>
          </Box>

          <Stack spacing={2}>
            {users.map((user) => (
              <ElevatedCard key={user.id} sx={{ p: 2 }}>
                <TextH6Bold sx={{ mb: 1 }}>{user.name}</TextH6Bold>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" color="primary" />
                  <TextBody1Neutral80>{user.email}</TextBody1Neutral80>
                </Box>
              </ElevatedCard>
            ))}
          </Stack>
        </>
      )}
    </Box>
  )
}
