import { DeleteForever, Logout } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  ElevatedCard,
  PageContainer,
  PageHeader,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
} from '../../shared/components'
import { useAuth, useTranslation } from '../../shared/hooks'
import { Routes } from '../../utils'
import { DeleteAccountDialog } from './components/DeleteAccountDialog'
import { useDeleteAccountMutation } from './useDeleteAccountMutation'

export function AccountPage() {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isConfirming, setIsConfirming] = useState(false)
  const deleteAccount = useDeleteAccountMutation()

  const handleSignOut = async () => {
    await signOut()
    await navigate(Routes.SIGN_IN)
  }

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
          <Button variant="outline" startIcon={<Logout />} onClick={() => void handleSignOut()}>
            {t('home.signOut')}
          </Button>
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
