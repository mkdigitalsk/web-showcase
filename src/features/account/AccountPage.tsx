import { DeleteForever, Logout } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import {
  AlertError,
  Button,
  ElevatedCard,
  PageContainer,
  PageHeader,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
} from '../../shared/components'
import { requestErrorKey } from '../../shared/api'
import { useAuth, useTranslation } from '../../shared/hooks'
import { DeleteAccountDialog } from './components/DeleteAccountDialog'
import { useDeleteAccountMutation } from './useDeleteAccountMutation'
import { useSignOutMutation } from './useSignOutMutation'

export default function AccountPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isConfirming, setIsConfirming] = useState(false)
  const signOut = useSignOutMutation()
  const deleteAccount = useDeleteAccountMutation()

  const closeDialog = () => {
    if (deleteAccount.isPending) return
    deleteAccount.reset()
    setIsConfirming(false)
  }

  return (
    <PageContainer>
      <PageHeader title={t('account.title')} description={t('account.subtitle')} />

      <Stack spacing={3}>
        <ElevatedCard sx={{ p: 2 }}>
          <TextCaptionNeutral60>{t('account.email')}</TextCaptionNeutral60>
          <TextBody1Neutral80>{user?.email}</TextBody1Neutral80>
        </ElevatedCard>

        <Box>
          <Button variant="outline" startIcon={<Logout />} loading={signOut.isPending} onClick={() => signOut.mutate()}>
            {t('home.signOut')}
          </Button>
          {signOut.error && <AlertError sx={{ mt: 2 }}>{t(requestErrorKey(signOut.error, 'common.error'))}</AlertError>}
        </Box>

        <Box>
          {user?.demo ? (
            <TextBody1Neutral60>{t('account.deleteDemo')}</TextBody1Neutral60>
          ) : (
            <Button color="error" startIcon={<DeleteForever />} onClick={() => setIsConfirming(true)}>
              {t('account.delete')}
            </Button>
          )}
        </Box>
      </Stack>

      {isConfirming && (
        <DeleteAccountDialog
          error={deleteAccount.error}
          isDeleting={deleteAccount.isPending}
          onCancel={closeDialog}
          onConfirm={() => deleteAccount.mutate()}
        />
      )}
    </PageContainer>
  )
}
